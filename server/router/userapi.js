
import { apiMatch } from '../controls'
import { METHOD_NUM } from '../Enum'
import jsonsql from '@smartx/jsonsql'

export default function (router) {
    router.all('/userapi/*', async (ctx, next) => {
        const path = ctx.path.replace('/userapi', '')
        const method = METHOD_NUM[ctx.method]

        const data = await apiMatch({ path, method })

        if (data === undefined) {
            ctx.body = { code: 404, message: '接口未定义' }
            return
        }

        const { response } = data
        const { query, body, header } = ctx.request
        ctx.body = await jsonsql.compile(response || '').execute({ $query: query, $body: body, $header: header })
    })
}
