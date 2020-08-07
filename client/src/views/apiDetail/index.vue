<template>
  <div class="view-api-detail">
    <a-layout>
      <project-sidebar />
      <a-layout-content style="margin-left:361px;padding:10px; min-width:800px">
        <base-info :bridge="baseInfo" />
        <request-info :bridge="requestInfo" />
        <response-info :bridge="responseInfo" />
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
        const { projectId, apiId } = this.$route.params
        const bridge = this.$bridge.create({
            vm: this,
            state: {
                projectId,
                apiId,
                apiData: {},
            },
            events: {
                reloadApiData: () => {
                    this.$bridge.send('API_UPDATE')
                    this.getApiDetail()
                },
            },
        })

        bridge.$mapState([ 'projectId', 'apiId', 'apiData' ])

        return {
            bridge,
            baseInfo: bridge.$connect(),
            requestInfo: bridge.$connect(),
            responseInfo: bridge.$connect(),
        }
    },
    watch: {
        '$route.params.apiId' (newId, oldId) {
            this.apiId = newId
            this.getApiDetail()
        },
    },
    created () {
        this.getApiDetail()
    },
    methods: {
        getApiDetail () {
            this.$api.getApiDetail({ apiId: this.apiId }, { logger: true }).then(data => {
                this.apiData = data
            })
        },
    },
}
</script>

<style lang="less">
.view-api-detail {
}
</style>
