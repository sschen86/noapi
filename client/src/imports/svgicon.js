import path from 'path'
import Vue from 'vue'
import svgicon from '../svgicon/'

Vue.component('svg-icon', svgicon)

const publics = require.context('../svgicon/svgs', true, /\.svg$/) // 公用的svg
const components = require.context('../components', true, /\.svg$/) // 公用组件的svg
const views = require.context('../views', true, /\.svg$/) // 页面私有的svg

const unique = {} // 同名svg导入校验，出现同名会提示导入失败
;[ publics, components, views ].forEach(svgRequire => {
    const prefixPath = svgRequire.id.split(' ')[0]
    svgRequire.keys().forEach(key => {
        const id = path.basename(key)
        if (unique[id]) {
            return console.error('svg同名，导入失败', {
                allreadySvg: unique[id],
                currentSvg: prefixPath + key.substr(1),
            })
        }
        unique[id] = prefixPath + key.substr(1)
        svgRequire(key) // 导入模块
    })
})
