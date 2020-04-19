import Koa from 'koa'
import koaBody from 'koa-body'
import router from './router'

const app = new Koa()
app.use(koaBody({
    multipart: true,
    formLimit: '5mb',
}))
app.use(router.routes())
app.listen(666)
