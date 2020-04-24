import Vue from 'vue'
import VueRouter from 'vue-router'
import BasicLayout from '../components/BasicLayout/'


Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '',
            component: BasicLayout,
            children: [
                { path: '/', component: () => import(/* webpackChunkName: "index" */ '../views/home') },
                { path: '/project/:projectId', component: () => import(/* webpackChunkName: "index" */ '../views/apiList') },
                { path: '/project/:projectId/api/:apiId', component: () => import(/* webpackChunkName: "index" */ '../views/apiDetail') },
            ],
        },
        { path: '/login', component: () => import(/* webpackChunkName: "index" */ '../views/login') },
        { path: '*', redirect: '/' },
    ],
})
