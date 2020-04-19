<template>
  <div class="view-api-list">
    <a-layout>
      <project-sidebar />
      <a-layout-content style="margin-left:361px;padding:10px">
        <c-table class="api-list" :option="apiList" />
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
import ProjectSidebar from '../../components/ProjectSidebar'
export default {
    components: { ProjectSidebar },
    data () {
        return {
            apiList: {
                title: '接口列表',
                bordered: false,
                scrollX: 880,
                columns: [
                    [ '接口名称', 'name', {
                        width: 200,
                        customRender: (value) => {
                            return (
                                <router-link to={{ path: '/api/666' } }>
                                    {value}
                                </router-link>
                            )
                        },
                    } ],
                    [ '接口地址', 'path', {
                        width: 400,
                        customRender: (value, { method }) => {
                            return (
                                <div class={`icon-method-${method}`}>{value}</div>
                            )
                        },
                    } ],
                    [ '接口状态', 'status', { width: 120 } ],
                    [ '更新时间', 'updateTime' ],
                ],
                dataSource (params) {
                    return {
                        page: params.page,
                        total: 123,
                        data: [
                            { id: '1', name: '获取文章列表', method: 'PUT', path: '/getPostList', status: '已完成', updateTime: '2012/12/12 09:12' },
                            { id: '2', name: '获取删除文章', method: 'POST', path: '/deletePost', status: '更新中', updateTime: '2012/12/12 09:12' },
                            { id: '2', name: '获取删除文章', path: '/deletePost', status: '更新中', updateTime: '2012/12/12 09:12' },
                            { id: '2', name: '获取删除文章', path: '/deletePost', status: '更新中', updateTime: '2012/12/12 09:12' },
                            { id: '2', name: '获取删除文章', path: '/deletePost', status: '更新中', updateTime: '2012/12/12 09:12' },
                            { id: '2', name: '获取删除文章', path: '/deletePost', status: '更新中', updateTime: '2012/12/12 09:12' },
                            { id: '2', name: '获取删除文章', path: '/deletePost', status: '更新中', updateTime: '2012/12/12 09:12' },
                            { id: '2', name: '获取删除文章', path: '/deletePost', status: '更新中', updateTime: '2012/12/12 09:12' },
                            { id: '2', name: '获取删除文章', path: '/deletePost', status: '更新中', updateTime: '2012/12/12 09:12' },
                            { id: '2', name: '获取删除文章', path: '/deletePost', status: '更新中', updateTime: '2012/12/12 09:12' },
                            { id: '2', name: '获取删除文章', path: '/deletePost', status: '更新中', updateTime: '2012/12/12 09:12' },
                            { id: '2', name: '获取删除文章', path: '/deletePost', status: '更新中', updateTime: '2012/12/12 09:12' },
                            { id: '2', name: '获取删除文章', path: '/deletePost', status: '更新中', updateTime: '2012/12/12 09:12' },
                            { id: '2', name: '获取删除文章', path: '/deletePost', status: '更新中', updateTime: '2012/12/12 09:12' },
                            { id: '2', name: '获取删除文章', path: '/deletePost', status: '更新中', updateTime: '2012/12/12 09:12' },
                        ],
                    }
                },
            },
        }
    },
}
</script>

<style lang="less">
.view-api-list {
    .api-list {
        .icon-method-GET,
        .icon-method-undefined {
            &:before {
                content: "GET";
                font-size: 12px;
                background: green;
                color: #fff;
                border-radius: 4px;
                padding: 2px 6px;
                margin-right: 6px;
            }
        }
        .icon-method-POST {
            &:before {
                content: "POST";
                font-size: 12px;
                background: orange;
                color: #fff;
                border-radius: 4px;
                padding: 2px 6px;
                margin-right: 6px;
            }
        }
        .icon-method-PUT {
            &:before {
                content: "PUT";
                font-size: 12px;
                background: orange;
                color: #fff;
                border-radius: 4px;
                padding: 2px 6px;
                margin-right: 6px;
            }
        }
    }
}
</style>
