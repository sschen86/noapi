import Vue from 'vue'
import Main from './main.vue'

import './imports'

import store from './store/'
import router from './router/'

Vue.config.productionTip = false

new Vue({
    store,
    router,
    render: h => h(Main),
}).$mount('#main')
