<template>
  <div class="view-api-detail">
    <a-layout>
      <project-sidebar />
      <a-layout-content style="margin-left:361px;padding:10px">
        <base-info />
        <request-info />
        <response-info />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import ProjectSidebar from '../../components/ProjectSidebar'
import BaseInfo from './components/base'
import requestInfo from './components/request'
import responseInfo from './components/response'
export default {
    components: { ProjectSidebar, BaseInfo, requestInfo, responseInfo },
    data () {
        return {

        }
    },
}
</script>

<style lang="less">
.view-api-detail {
}
</style>
