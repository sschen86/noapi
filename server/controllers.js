import md5 from 'md5'
import { get, run, all, insert, update, exec } from './database'
import jsonsql from './plugins/jsonsql'
import { match } from 'path-to-regexp'

export async function userQuery ({ user, password }) {
    return get(`
        SELECT id,name,role,nick FROM user WHERE name='${user}' AND password='${md5(password)}'
    `)
}

export async function myProjectsGet ({ userId }) {
    return all(`
        SELECT * FROM projectFavorite INNER JOIN  project ON projectFavorite.userId = ${userId} AND projectFavorite.projectId = project.id
    `)
}

export async function allProjectsGet ({ page, pageSize }) {
    return all(`
        SELECT * FROM project
    `)
}

export async function projectCreate ({ name, description, userId }) {
    await insert('project', {
        name, description, createTime: Date.now(),
    })

    const { projectId } = await get('SELECT last_insert_rowid() as projectId  FROM project')

    await insert('projectFavorite', {
        projectId, userId,
    })
}

export async function projectFavoriteAdd ({ userId, projectId }) {
    await insert('projectFavorite', {
        userId, projectId,
    })
}

export async function projectFavoriteRemove ({ userId, projectId }) {
    await run(`
        DELETE FROM projectFavorite WHERE userId = ${userId} AND projectId = ${projectId}
    `)
}


export async function projectGet ({ projectId }) {
    return get(`
        SELECT * FROM project WHERE id = ${projectId}
    `)
}


export async function projectSet ({ id, name, description }) {
    await update('project', { id, name, description }, `WHERE id = ${id}`)
}

// 查询分类列表
export async function categorysGet ({ projectId, parentId = 'NULL' }) {
    const rs = await all(`
        SELECT * FROM category WHERE projectId=${projectId}
    `)

    const lg = rs.length
    if (lg === 0) {
        return []
    }

    // previousId 实现链表指针关联
    const map = {}
    for (let i = 0; i < lg; i++) {
        const item = rs[i]
        map[item.id] = item
    }

    rs.forEach(item => {
        item.next = map[item.nextId]
        delete map[item.nextId]
    })
    // 剩下没被使用的就是最后一个节点了
    for (const key in map) {
        const newRs = []
        let pointer = map[key]
        while (pointer) {
            newRs.push(pointer)
            const cur = pointer
            pointer = pointer.next

            // 断开链表，回收无用属性
            cur.next = undefined
            cur.prevId = undefined
            cur.nextId = undefined
        }
        return newRs
    }

    /* const rs = await all(`
        SELECT * FROM category WHERE projectId=${projectId} AND ${parentId === 'NULL' ? 'parent_id IS NULL' : `parent_id = ${parentId}`}
    `) */
    // console.info(`SELECT * FROM category WHERE ${parentId === 'NULL' ? 'parent_id IS NULL' : `parent_id = ${parentId}`}`, rs)
    // return rs
}

// 创建分类
export async function categoryCreate ({ projectId, name, parentId }) {
    const tailCate = await get(`
        SELECT id FROM category WHERE projectId=${projectId} AND nextId IS NULL
    `)

    // 没有节点，直接插入数据
    if (!tailCate) {
        return insert('category', { projectId, name, parentId })
    }

    const tailCateId = tailCate.id
    try {
        await run('BEGIN;')
        const { lastID } = await insert('category', { projectId, name, parentId, prevId: tailCateId })
        await run(`
            UPDATE category SET nextId=${lastID} WHERE id=${tailCateId};
        `)
        await run('COMMIT;')
    } catch (e) {
        await run('ROLLBACK')
        throw e
    }

    // await insert('category', { projectId, name, parentId })
}

// 修改分类
export async function categoryEdit ({ id, name, parentId }) {
    await update('category', { name, parentId }, `WHERE id = ${id}`)
}

// 删除分类
export async function categoryDelete ({ id }) {
    const cateSelf = await get(`
        SELECT prevId, nextId FROM category WHERE id=${id}
    `)
    const sqlExpression = [
        'BEGIN;',
        `DELETE FROM category WHERE id=${id} OR parentId = ${id};`, // 删除分类
        `UPDATE api SET categoryId=NULL WHERE categoryId=${id};`, // 将所有接口的分类移除
    ]
    // 需要改变它的nextId
    if (cateSelf.prevId) {
        sqlExpression.push(`
            UPDATE category SET nextId=${cateSelf.nextId || 'NULL'} WHERE id=${cateSelf.prevId};
        `)
    }
    // 需要改变它的prevId
    if (cateSelf.nextId) {
        sqlExpression.push(`
            UPDATE category SET prevId=${cateSelf.prevId || 'NULL'} WHERE id=${cateSelf.nextId};
        `)
    }
    sqlExpression.push('COMMIT;')
    // console.info(sqlExpression.join('\n'))
    await exec(sqlExpression.join('\n'))

    // await run(`
    //     DELETE FROM category WHERE id = ${id} OR parentId = ${id}
    // `)
}

// 移动分类
export async function categoryMove ({ projectId, targetId, selfId }) {
    // 获取self记录，取得变量self.id, self.prevId, self.nextId
    // 获取target记录，获取变量target.id, target.nextId

    // 变更self.prev的nextId为self.nextId
    // 变更self.next的prevId为self.prevId
    // 变更self.prevId为target.id
    // 变更self.nextId为target.nextId
    // 变更target.nextId为self.id
    // 变更target.next.prevId为self.id

    let apiSelfId
    let apiTargetId
    let cateSelfId
    let cateTargetId
    let apiMove = false
    let cateMove = false

    // 移动API
    if (selfId.includes('#')) {
        apiSelfId = selfId.substr(1)
    } else if (selfId.includes('-')) {
        ([ cateSelfId, apiSelfId ] = selfId.split('-'))
    } else {
        cateSelfId = selfId
    }

    if (targetId.includes('#')) {
        apiTargetId = targetId.substr(1)
    } else if (targetId.includes('-')) {
        ([ cateTargetId, apiTargetId ] = targetId.split('-'))
    } else {
        cateTargetId = targetId
    }

    // 1. 仅移动分类
    // 2. 仅移动API
    // 3. 改变API分类，并进行移动

    if (apiSelfId !== apiTargetId) {
        apiMove = true
    }

    if (cateSelfId !== cateTargetId) {
        cateMove = true
    }

    // 仅移动分类
    if (cateMove && !apiMove) {
        cateSelfId = Number(cateSelfId)
        cateTargetId = Number(cateTargetId)

        const cates = await all(`
            SELECT * FROM category WHERE projectId=${projectId} AND (id=${cateTargetId} OR id=${cateSelfId})
        `)

        // 获取移动分类和目标分类
        let cateSelf, cateTarget
        cates.forEach(item => {
            if (item.id === cateSelfId) {
                cateSelf = item
            } else if (item.id === cateTargetId) {
                cateTarget = item
            }
        })

        // 互换目标
        if (cateSelf.prevId === cateTargetId) {
            ([ cateSelf, cateTarget ] = [ cateTarget, cateSelf ])
        }

        const sqlExpression = [ 'BEGIN;' ]
        // 存在prev节点
        if (cateSelf.prevId) {
            sqlExpression.push(`UPDATE category SET nextId=${cateSelf.nextId} WHERE id=${cateSelf.prevId};`)
        }
        // 更新下一个节点
        if (cateSelf.nextId) {
            sqlExpression.push(`UPDATE category SET prevId=${cateSelf.prevId || 'NULL'} WHERE id=${cateSelf.nextId};`)
        }
        // 更新目标节点的下一个节点
        if (cateTarget.nextId) {
            sqlExpression.push(`UPDATE category SET prevId=${cateSelf.id} WHERE id=${cateTarget.nextId};`)
        }
        sqlExpression.push(`UPDATE category SET prevId=${cateTarget.id}, nextId=${cateTarget.nextId || 'NULL'} WHERE id=${cateSelf.id};`)
        sqlExpression.push(`UPDATE category SET nextId=${cateSelf.id} WHERE id=${cateTarget.id};`)
        sqlExpression.push('COMMIT;')

        await exec(sqlExpression.join('\n'))
        return
    }

    // 仅移动API，可能涉及分类变更
    if (apiMove) {
        apiSelfId = Number(apiSelfId)
        apiTargetId = Number(apiTargetId)
        cateTargetId = Number(cateTargetId)
        // 仅改变分类
        if (!apiTargetId) {
            return exec(`UPDATE api SET categoryId=${cateTargetId || 'NULL'} WHERE id=${apiSelfId};`)
        }

        const apis = await all(`
            SELECT * FROM api WHERE projectId=${projectId} AND (id=${apiTargetId} OR id=${apiSelfId})
        `)

        // 获取移动API和目标API
        let apiSelf, apiTarget
        apis.forEach(item => {
            if (item.id === apiSelfId) {
                apiSelf = item
            } else if (item.id === apiTargetId) {
                apiTarget = item
            }
        })

        // 互换目标
        if (apiSelf.prevId === apiTargetId) {
            ([ apiSelf, apiTarget ] = [ apiTarget, apiSelf ])
        }

        const sqlExpression = [ 'BEGIN;' ]

        // 分类发生变更
        if (cateMove) {
            sqlExpression.push(`UPDATE api SET categoryId=${cateTargetId || 'NULL'} WHERE id=${apiSelf.id};`)
        }
        // 存在prev节点
        if (apiSelf.prevId) {
            sqlExpression.push(`UPDATE api SET nextId=${apiSelf.nextId} WHERE id=${apiSelf.prevId};`)
        }
        // 更新下一个节点
        if (apiSelf.nextId) {
            sqlExpression.push(`UPDATE api SET prevId=${apiSelf.prevId || 'NULL'} WHERE id=${apiSelf.nextId};`)
        }
        // 更新目标节点的下一个节点
        if (apiTarget.nextId) {
            sqlExpression.push(`UPDATE api SET prevId=${apiSelf.id} WHERE id=${apiTarget.nextId};`)
        }
        sqlExpression.push(`UPDATE api SET prevId=${apiTarget.id}, nextId=${apiTarget.nextId || 'NULL'} WHERE id=${apiSelf.id};`)
        sqlExpression.push(`UPDATE api SET nextId=${apiSelf.id} WHERE id=${apiTarget.id};`)
        sqlExpression.push('COMMIT;')

        await exec(sqlExpression.join('\n'))
    }
}

// 查询接口列表
export async function apisGet ({ projectId }) {
    const rs = await all(`
        SELECT id, name, categoryId, prevId, nextId FROM api WHERE projectId = ${projectId}
    `)

    const lg = rs.length
    if (lg === 0) {
        return []
    }

    // previousId 实现链表指针关联
    const map = {}
    for (let i = 0; i < lg; i++) {
        const item = rs[i]
        map[item.id] = item
    }

    rs.forEach(item => {
        item.next = map[item.nextId]
        delete map[item.nextId]
    })
    // 剩下没被使用的就是最后一个节点了
    for (const key in map) {
        const newRs = []
        let pointer = map[key]
        while (pointer) {
            newRs.push(pointer)
            const cur = pointer
            pointer = pointer.next

            // 断开链表，回收无用属性
            cur.next = undefined
            cur.prevId = undefined
            cur.nextId = undefined
        }
        return newRs
    }

    // const rs = await all(`
    //     SELECT id, name, categoryId FROM api WHERE projectId = ${projectId}
    // `)
    // return rs
}

// 查询接口详情
export async function apiGet ({ id }) {
    const data = await get(`
        SELECT * FROM api WHERE id = ${id}
    `)
    return data
}

// 创建接口
export async function apiCreate ({ path, name, method, reqContextType, reqData, resData, projectId, categoryId }) {
    // 获取链表尾
    const tailRecord = await get(`
        SELECT id FROM api WHERE projectId=${projectId} AND nextId IS NULL
    `)

    // 没有节点，直接插入数据
    if (!tailRecord) {
        return insert('api', {
            path, name, method, reqContextType, reqData, resData, projectId, categoryId,
        })
    }

    const tailId = tailRecord.id
    try {
        await run('BEGIN;')
        const { lastID } = await insert('api', { path, name, method, reqContextType, reqData, resData, projectId, categoryId, prevId: tailId })
        await run(`
            UPDATE api SET nextId=${lastID} WHERE id=${tailId};
        `)
        await run('COMMIT;')
        updateApiMatchs({ id: lastID, type: 'add', value: path, method })
    } catch (e) {
        await run('ROLLBACK')
        throw e
    }
}

// 修改接口
export async function apiEdit ({ id, path, name, method, description, reqContextType, reqData, resData, categoryId }) {
    await update('api', { path, name, method, reqContextType, reqData, resData, categoryId, description: description || null }, `WHERE id = ${id}`)
    if (path) {
        updateApiMatchs({ id, type: 'update', value: path, method })
    }
}

// 接口搜索
export async function apiSearch ({ projectId, value }) {
    const data = await all(`
        SELECT id,name FROM api WHERE projectId = ${projectId} AND (path LIKE "%${value}%" OR name LIKE "%${value}%")
    `)
    return data
}

// 删除接口
export async function apiDelete ({ id }) {
    const selfRecord = await get(`
        SELECT prevId, nextId FROM api WHERE id=${id}
    `)
    const sqlExpression = [ 'BEGIN;', `DELETE FROM api WHERE id=${id};` ]
    // 需要改变它的nextId
    if (selfRecord.prevId) {
        sqlExpression.push(`UPDATE api SET nextId=${selfRecord.nextId || 'NULL'} WHERE id=${selfRecord.prevId};`)
    }
    // 需要改变它的prevId
    if (selfRecord.nextId) {
        sqlExpression.push(`UPDATE api SET prevId=${selfRecord.prevId || 'NULL'} WHERE id=${selfRecord.nextId};`)
    }
    sqlExpression.push('COMMIT;')
    await exec(sqlExpression.join('\n'))
    updateApiMatchs({ id, type: 'remove' })
    // await run(`
    //     DELETE FROM api WHERE id = ${id}
    // `)
}

export async function apiListGet ({ projectId, page, pageSize }) {
    pageSize = Math.min(pageSize, 100)

    const { total } = await get(`
        SELECT count(*) as total FROM api WHERE projectId = ${projectId}
    `)
    let data
    if (total > 0) {
        data = await all(`
            SELECT *  FROM api WHERE projectId = ${projectId}
        `)
    }

    return { total, page: Number(page), pageSize, data }
}


export async function apiDetailGet ({ apiId }) {
    const data = await get(`
        SELECT * FROM api WHERE id=${apiId}
    `)

    data.mockReqData = await jsonsql.data(data.reqData)
    data.mockReqDoc = jsonsql.doc(data.reqData)
    data.mockResDoc = jsonsql.doc(data.resData)
    // data.mockResData = jsonsql.data(data.resData, data.mockReqData)

    return data
}


// 精确匹配api

export async function apiMatch ({ path, method }) {
    if (!apiMatchsReady) {
        apiMatchsReady = true
        const apis = await all('SELECT * FROM api')
        apis.forEach(api => {
            updateApiMatchs({ id: api.id, value: api.path, method: api.method })
        })
    }

    let apiId
    console.info({ apiMatchs })
    for (const id in apiMatchs) {
        const { match, method: matchMethod } = apiMatchs[id]
        if (match(path) && matchMethod === method) {
            apiId = Number(id)
            break
        }
    }
    return get(`SELECT * FROM api WHERE id=${apiId}`)
}

// api请求路径匹配正则
let apiMatchsReady = false
const apiMatchs = {}

// 更新API映射关系
export function updateApiMatchs ({ id, type = 'add', method, value }) {
    switch (type) {
        case 'add':
        case 'update': {
            apiMatchs[id] = {
                method,
                path: value,
                match: match(value, { decode: decodeURIComponent }),
            }
            break
        }
        case 'remove': {
            delete apiMatchs[id]
            break
        }
    }
}
