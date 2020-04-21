import Router from 'koa-router'
import openapi from './openapi'
import mockapi from './mockapi'

const router = new Router()

openapi(router)
mockapi(router)

export default router
