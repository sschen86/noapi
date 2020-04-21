import md5 from 'md5'
import { get, run, all, insert, update } from './database'


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
    /* const rs = await all(`
        SELECT * FROM category WHERE projectId=${projectId} AND ${parentId === 'NULL' ? 'parent_id IS NULL' : `parent_id = ${parentId}`}
    `) */
    // console.info(`SELECT * FROM category WHERE ${parentId === 'NULL' ? 'parent_id IS NULL' : `parent_id = ${parentId}`}`, rs)
    return rs
}

// 创建分类
export async function categoryCreate ({ projectId, name, parentId }) {
    await insert('category', { projectId, name, parentId })
}

// 修改分类
export async function categoryEdit ({ id, name, parentId }) {
    await update('category', { name, parentId }, `WHERE id = ${id}`)
}

// 删除分类
export async function categoryDelete ({ id }) {
    await run(`
        DELETE FROM category WHERE id = ${id} OR parentId = ${id}
    `)
}

// 查询接口列表
export async function apisGet ({ projectId }) {
    const rs = await all(`
        SELECT id, name, categoryId FROM api WHERE projectId = ${projectId}
    `)
    return rs
}

// 查询接口详情
export async function apiGet ({ id }) {
    const data = await get(`
        SELECT * FROM api WHERE id = ${id}
    `)

    return data
}

// 创建接口
export async function apiCreate ({ path, name, method, reqContextType, request, response, projectId, categoryId }) {
    await insert('api', {
        path, name, method, reqContextType, request, response, projectId, categoryId,
    })
}

// 修改接口
export async function apiEdit ({ id, label, path, name, method, reqContextType, request, response, categoryId }) {
    await update('api', { label, path, name, method, reqContextType, request, response, categoryId }, `WHERE id = ${id}`)
}

// 删除接口
export async function apiDelete ({ id }) {
    await run(`
        DELETE FROM api WHERE id = ${id}
    `)
}

// 匹配api

export async function apiMatch ({ path, method }) {
    return get(`
        SELECT * FROM api WHERE path = '${path}' AND method = ${method}
    `)
}
