<template>
  <a-layout class="basic-layout">
    <a-layout class="basic-content">
      <basic-header :collapsed="collapsed" @toggle="toggle" />
      <router-view />
    </a-layout>
  </a-layout>
</template>
<script>
import BasicHeader from '../BasicHeader'

export default {
    components: {
        BasicHeader,
    },
    data () {
        return {}
    },
    computed: {
        collapsed () {
            return this.$state.app.sidebar.collapsed
        },
        paddingLeft () {
            return this.collapsed ? '80px' : '200px'
        },
    },
    mounted () {
    },
    methods: {
        toggle () {
            this.$store.commit('TOGGLE_SIDEBAR')
        },
    },
}
</script>
<style lang="less">
.basic-layout {
    //height: auto;
    //overflow-x: hidden;

    .basic-content {
        // overflow-y: scroll;
        // height: 100vh;

        &.ant-layout {
            background-color: rgba(248, 248, 251, 1);
        }
    }
}
</style>
