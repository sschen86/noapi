import Vue from 'vue'
import vueBridge from '../packages/vueBridge'
import adapter from '@smartx/adapter'

Vue.prototype.$createBridge = vueBridge

// 输入框工具集
Vue.prototype.$input = {
    trim: (e) => e.target.value = e.target.value.trim(),
}

// 新开窗口
Vue.prototype.$openWindow = function (route) {
    window.open(this.$router.resolve(route).href, '_blank')
}

// 适配器
Vue.prototype.$adapter = adapter
