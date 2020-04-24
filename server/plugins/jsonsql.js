import jsonsql from '@smartx/jsonsql'

export default {
    async data (source, data) {
        return jsonsql.compile(source || '').execute(data)
    },
    doc (source) {
        return jsonsql.compile(source || '').document()
    },
}
