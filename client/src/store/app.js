export default {
    config: {
        state: {
            sidebar: { // 侧边栏
                collapsed: false, // 收起状态
            },
        },
        getters: {

        },
        actions: {

        },
        mutations: {
            TOGGLE_SIDEBAR (state) {
                state.sidebar.collapsed = !state.sidebar.collapsed
            },
        },
    },
    paths: [
        'sidebar.collapsed',
    ],
}
