import vue from 'vue'
import ema from 'easy-mockapi2'
import adapter from '@smartx/adapter'
import { object } from 'fly-utils'
import { message, Modal } from 'ant-design-vue'

import jsonsql from '@smartx/jsonsql'


vue.prototype.$api = ema({
    baseURL: '/openapi/',
    // logger: true,
    configs: {
        login: {
            method: 'post',
            url: 'login',
        },
        getMyProjects: {
            url: 'get_my_projects',
        },
        getAllProjects: {
            url: 'get_all_projects',
            resa: {
                $strict: false,
                $increase: {
                    isFollow: { $value: () => false },
                },
            },
        },
        createProject: {
            method: 'post',
            url: 'create_project',
        },
        addProjectFavorite: {
            method: 'post',
            url: 'add_project_favorite',
        },
        removeProjectFavorite: {
            method: 'post',
            url: 'remove_project_favorite',
        },

        getProject: {
            url: 'get_project',
        },
        eidtProject: {
            method: 'post',
            url: 'edit_project',
        },

        getProjectCategorys: {
            url: 'get_categorys',
            resa: {
                id: [ true, 'key' ],
                name: 'title',
                parentId: true,
            },
        },
        createCategory: {
            method: 'post',
            url: 'create_category',
        },
        deleteCategory: {
            method: 'post',
            url: 'delete_category',
        },
        editCategory: {
            method: 'post',
            url: 'edit_category',
        },
        createApi: {
            method: 'post',
            url: 'create_api',
        },
        getProjectApis: {
            url: 'get_apis',
            resa: {
                id: [ true, 'key' ],
                name: 'title',
                categoryId: 'parentId',
                $increase: {
                    isLeaf: true,
                },
            },
        },
        deleteApi: {
            method: 'post',
            url: 'delete_api',
        },

        getApiList: {
            url: 'get_api_list',
            resa: {
                $strict: false,
                data: {
                    $increase: {
                        status: '--',
                        updateTime: '--',
                    },
                },
            },
        },

        getApiDetail: {
            url: 'get_api_detail',
            resa: {
                $strict: false,
                method: [ true, { $key: 'methodText', $enum: [ 'GET', 'POST' ] } ],
                mockReqDoc: {
                    key: [ true, 'name' ],
                    types: [
                        { $value: (value) => value.filter(item => item !== 'null') },
                        { $key: 'required', $value: (value) => value.includes('null') ? '否' : '是' },
                    ],
                    $increase: { defaultValue: () => '-' },
                    description: true,
                },
                mockResDoc: true,
            },
            mockData2 ({ data }) {
                return {
                    code: 0,
                    data: {
                        apiId: data.apiId,
                        name: '接口名称',
                        path: 'jjhjhj',
                        method: 0,
                        methodText: 'GET',
                    },
                }
            },
        },

        editApi: {
            method: 'post',
            url: 'edit_api',
        },
    },
    props: {
        reqa (value, type) {
            if (type === 'function') {
                return value
            }
            if (value && type === 'object') {
                return adapter(value).input
            }
        },
        resa (value, type) {
            if (type === 'function') {
                return value
            }
            if (value && type === 'object') {
                return adapter(value).input
            }
        },
    },
    request (data, config) {
        const { reqa, mockData } = config

        // 添加登录验签
        config.headers.token = 'token'

        // 请求参数进行适配处理
        if (reqa) {
            object.emptyAssign(data, reqa(data))
        }

        if (mockData && typeof mockData === 'string') {
            config._mockDataSource = mockData
            config.mockData = function (params) {
                return mockJSON(config._mockDataSource, params)
            }
        }
    },
    response (resp, { responseType }) {
        // 二进制数据，直接返回
        if (responseType === 'arraybuffer') {
            return resp
        }

        const { code, message } = resp.data
        if (code !== 0) {
            // eslint-disable-next-line no-throw-literal
            throw { code, message }
        }
    },
    success (data, config) {
        const { resa } = config
        // 响应数据适配器
        if (resa && config.responseType !== 'arraybuffer') {
            data.data = resa(data.data)
        }

        // data = {code:0, message:'处理成功', data:{}} 直接返回业务数据data.data
        return data.data
    },

    failure (error, config) {
        if (error.code === 10101) { // 未登录
            Modal.confirm({
                title: '确定重新登录',
                content: '登录信息已失效，点击取消继续留在该页面，或者重新登录',
                okText: '重新登录',
                width: 500,
                centered: true,
                onOk () {
                    window.location.href = '/login'
                },
                onCancel () {},
            })
        } else {
            message.error(error.message || '未知错误', 0.6)
            if (error.stack) {
                console.error(error.stack)
            }
        }
    },
})

vue.prototype.$mockapi = ema({
    baseURL: '/mockapi/',
    configs: {
        send: {
            url: '',
        },
    },
})

function mockJSON (source, params) {
    return jsonsql.compile(source).execute({
        $data: params.data,
        $headers: params.headers,
    })
}
