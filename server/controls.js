import { get, run, exec, all, insert, update } from './database'

// 查询分类列表
export async function categorysGet ({ parentId = 'NULL' }) {
    const rs = await all(`
        SELECT * FROM category WHERE ${parentId === 'NULL' ? 'parent_id IS NULL' : `parent_id = ${parentId}`}
    `)
    console.info(`SELECT * FROM category WHERE ${parentId === 'NULL' ? 'parent_id IS NULL' : `parent_id = ${parentId}`}`, rs)
    return rs
}

// 创建分类
export async function categoryCreate ({ label, parentId }) {
    await insert('category', { label, parentId })
}

// 修改分类
export async function categoryEdit ({ id, label, parentId = 'NULL' }) {
    await update('category', { label, parentId }, `WHERE id = ${id}`)
}

// 删除分类
export async function categoryDelete ({ id }) {
    await run(`
        DELETE FROM category WHERE id = ${id}
    `)
}

// 查询接口列表
export async function apisGet ({ categoryId = 'NULL' }) {
    const rs = await all(`
        SELECT id, name FROM api WHERE ${categoryId === 'NULL' ? 'category_id IS NULL' : `category_id = ${categoryId}`}
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
export async function apiCreate ({ path, name, method, reqContextType, request, response, categoryId }) {
    await insert('api', {
        path, name, method, reqContextType, request, response, categoryId,
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
