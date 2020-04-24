
import {
    userQuery,
    myProjectsGet,
    allProjectsGet,
    projectCreate,
    projectFavoriteAdd,
    projectFavoriteRemove,
    projectGet,
    projectSet,
    categorysGet,
    categoryCreate,
    categoryEdit,
    categoryDelete,
    apisGet,
    apiGet,
    apiCreate,
    apiEdit,
    apiDelete,
    apiListGet,
    apiDetailGet,
} from '../controllers'

// const openapis = [ createApi ]

export default function (router) {
    // openapis.forEach(({ path, method = 'get', middleware }) => {
    // router[method](`/openapi/${path}`, middleware)
    // })

    router.all('/openapi/*', async (ctx, next) => {
        ctx.session.userId = 1
        ctx.session.name = 'admin'
        await next()
    })

    router.post('/openapi/login', async ctx => {
        const data = await userQuery(ctx.request.body)

        if (!data) {
            return ctx.body = { code: 10, message: '登录失败' }
        }

        ctx.session.userId = data.id
        ctx.session.role = data.role
        ctx.body = { code: 0, message: '登录成功', data }
    })

    router.get('/openapi/get_my_projects', async ctx => {
        const rs = await myProjectsGet({ userId: ctx.session.userId })
        ctx.body = { code: 0, data: rs }
    })

    router.get('/openapi/get_all_projects', async ctx => {
        const rs = await allProjectsGet(ctx.request.query)
        ctx.body = { code: 0, data: rs }
    })

    router.post('/openapi/create_project', async ctx => {
        await projectCreate({ ...ctx.request.body, userId: ctx.session.userId })

        ctx.body = { code: 0 }
    })

    router.post('/openapi/add_project_favorite', async ctx => {
        await projectFavoriteAdd({ projectId: ctx.request.body.id, userId: ctx.session.userId })

        ctx.body = { code: 0 }
    })
    router.post('/openapi/remove_project_favorite', async ctx => {
        await projectFavoriteRemove({ projectId: ctx.request.body.id, userId: ctx.session.userId })
        ctx.body = { code: 0 }
    })

    router.get('/openapi/get_project', async ctx => {
        const data = await projectGet({ projectId: ctx.query.id })
        ctx.body = { code: 0, data }
    })

    router.post('/openapi/edit_project', async ctx => {
        await projectSet(ctx.request.body)
        ctx.body = { code: 0 }
    })


    router.get('/openapi/get_categorys', async ctx => {
        const rs = await categorysGet(ctx.request.query)
        ctx.body = { code: 0, data: rs }
    })

    router.post('/openapi/create_category', async ctx => {
        const { projectId, name, parentId } = ctx.request.body
        await categoryCreate({ projectId, name, parentId })
        ctx.body = { code: 0 }
    })

    router.post('/openapi/edit_category', async ctx => {
        await categoryEdit(ctx.request.body)
        ctx.body = { code: 0 }
    })

    router.post('/openapi/delete_category', async ctx => {
        await categoryDelete(ctx.request.body)
        ctx.body = { code: 0 }
    })


    router.post('/openapi/create_api', async ctx => {
        await apiCreate(ctx.request.body)
        ctx.body = { code: 0 }
    })

    router.get('/openapi/get_apis', async ctx => {
        const data = await apisGet(ctx.request.query)
        ctx.body = { code: 0, data }
    })

    router.get('/openapi/get_api', async ctx => {
        const rs = await apiGet(ctx.request.query)
        ctx.body = { code: 0, data: rs }
    })

    router.post('/openapi/edit_api', async ctx => {
        await apiEdit(ctx.request.body)
        ctx.body = { code: 0, message: 'c', data: ctx.request.body }
    })

    router.post('/openapi/delete_api', async ctx => {
        await apiDelete(ctx.request.body)
        ctx.body = { code: 0 }
    })

    router.get('/openapi/get_api_list', async ctx => {
        const { projectId, page, pageSize } = ctx.request.query
        ctx.body = { code: 0, data: await apiListGet({ projectId, page, pageSize }) }
    })

    router.get('/openapi/get_api_detail', async ctx => {
        const { apiId } = ctx.request.query
        const data = await apiDetailGet({ apiId })
        ctx.body = { code: 0, data }
    })


    router.all('/openapi/*', async (ctx, next) => {
        ctx.body = { url: ctx.url, path: ctx.path, code: 404, message: '接口未定义' }
    })
}

/*
db.save('id', data)
db.save('pplist', data)

db.get('api:1')
db.get('category:1')
db.set('api:1', {a:1})
db.del('api:3')

db = cubo({size:8})

categoey.set('1', {label:'xxx', apis:[1,2,3,4,5]})
*/
