

import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default function ({ modules: moduleMaps, useState }) {
    Vue.use(Vuex)

    const modules = {}
    const paths = []

    for (const key in moduleMaps) {
        const module = moduleMaps[key]

        // 注入模块配置
        modules[key] = module.config

        // 注入模块数据持久化路径配置
        module.paths.forEach(path => {
            paths.push(`${key}.${path}`)
        })
    }

    const store = new Vuex.Store({
        modules,
        plugins: [
        // 数据持久化插件，通过配置paths白名单来实现对应状态数据保存
            createPersistedState({
                paths,
            }),
        ],
    })

    if (useState !== false) {
        Vue.prototype.$state = store.state // 注入快捷方式$state到vue实列
    }


    return store
}
