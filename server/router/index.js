import Router from 'koa-router'
import openapi from './openapi'
import userapi from './userapi'

const router = new Router()

openapi(router)
userapi(router)

export default router
