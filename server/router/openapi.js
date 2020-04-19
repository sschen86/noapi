import { categorysGet, categoryCreate, categoryEdit, categoryDelete, apisGet, apiGet, apiCreate, apiEdit, apiDelete } from '../controls'

// const openapis = [ createApi ]

export default function (router) {
    // openapis.forEach(({ path, method = 'get', middleware }) => {
    // router[method](`/openapi/${path}`, middleware)
    // })


    router.get('/openapi/get_categorys', async ctx => {
        ctx.body = await categorysGet(ctx.request.query)
    })

    router.post('/openapi/create_category', async ctx => {
        ctx.body = await categoryCreate(ctx.request.body)
    })

    router.post('/openapi/edit_category', async ctx => {
        ctx.body = await categoryEdit(ctx.request.body)
    })

    router.post('/openapi/delete_category', async ctx => {
        ctx.body = await categoryDelete(ctx.request.body)
    })


    router.post('/openapi/create_api', async ctx => {
        ctx.body = await apiCreate(ctx.request.body)
    })

    router.get('/openapi/get_apis', async ctx => {
        ctx.body = await apisGet(ctx.request.query)
    })

    router.get('/openapi/get_api', async ctx => {
        ctx.body = await apiGet(ctx.request.query)
    })

    router.post('/openapi/edit_api', async ctx => {
        ctx.body = await apiEdit(ctx.request.body)
    })

    router.post('/openapi/delete_api', async ctx => {
        ctx.body = await apiDelete(ctx.request.body)
    })


    router.all('/openapi/*', async (ctx, next) => {
        ctx.body = { code: 404, message: '接口未定义' }
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
