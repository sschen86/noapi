import Koa from 'koa'
import favicon from './koa-middleware/favicon'
import session from './koa-middleware/session'
import koaBody from './koa-middleware/koaBody'
import statics from './koa-middleware/statics'
import router from './router'

const app = new Koa()

app.use(favicon)
app.use(session)
app.use(koaBody)
app.use(statics)
app.use(router.routes())
app.listen(666)
