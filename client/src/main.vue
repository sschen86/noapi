<template>
  <a-config-provider :locale="zhCN">
    <div id="main">
      <router-view />
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'

export default {
    data () {
        return {
            zhCN,
        }
    },
}
</script>
<style>
body {
    overflow-y: scroll;
}
</style>
