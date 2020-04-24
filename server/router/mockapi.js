import jsonsql from '@smartx/jsonsql'
import { apiMatch } from '../controllers'

const METHOD_NUM = { GET: 0, POST: 1, PUT: 2, DELETE: 3, OPTION: 4 }

export default function (router) {
    router.all('/mockapi/*', async (ctx, next) => {
        const path = ctx.path.replace('/mockapi/', '')
        const method = METHOD_NUM[ctx.method]

        // console.info({ path, method })


        const data = await apiMatch({ path, method })

        if (data === undefined) {
            ctx.body = { code: 404, message: '接口未定义' }
            return
        }

        const { resData } = data
        const { query, body, header } = ctx.request
        const jsonData = await jsonsql.compile(resData || '').execute({ $query: query, $body: body, $header: header })

        if (jsonData.$error) {
            return ctx.body = { $error: jsonData.$error.message }
        }
        // console.info({ jsonData })
        ctx.body = jsonData
    })
}
