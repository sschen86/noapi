<template>
  <div class="view-home">
    <a-row>
      <a-col :span="24">
        <c-table :option="dataView" />
      </a-col>
    </a-row>
    <a-row :gutter="[ 20,40 ]">
      <a-col :span="12">
        <a-card title="我的项目">
          <a-button slot="extra" type="primary" @click="() => createProjectDialog.open()">
            创建项目
          </a-button>

          <a-list item-layout="horizontal" :data-source="myProjects">
            <a-list-item slot="renderItem" slot-scope="item, index">
              <a-list-item-meta :description="item.description">
                <router-link slot="title" :to="{ path: '/project/' + item.id }">
                  {{ item.title }}
                </router-link>
                <a-avatar
                  slot="avatar"
                  src="https://img.alicdn.com/tfs/TB1SFZAvQL0gK0jSZFAXXcA9pXa-200-200.png"
                />
              </a-list-item-meta>
              <div>
                <a-button type="primary" @click="unfollowProject(item)">
                  取消关注
                </a-button>
              </div>
            </a-list-item>
          </a-list>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="全部项目">
          <a-list item-layout="horizontal" :data-source="myProjects">
            <a-list-item slot="renderItem" slot-scope="item, index">
              <a-list-item-meta :description="item.description">
                <a slot="title" href="https://www.antdv.com/">{{ item.title }}</a>
                <a-avatar
                  slot="avatar"
                  src="https://img.alicdn.com/tfs/TB1SFZAvQL0gK0jSZFAXXcA9pXa-200-200.png"
                />
              </a-list-item-meta>
              <div>
                <a-button v-if="item.isFollow" type="primary" @click="unfollowProject(item)">
                  取消关注
                </a-button>
                <a-button v-else type="primary" @click="onfollowProject(item)">
                  添加关注
                </a-button>
              </div>
            </a-list-item>
          </a-list>
        </a-card>
      </a-col>
    </a-row>

    <c-dialog :option="createProjectDialog" />
  </div>
</template>

<script>
export default {
    data () {
        return {
            myProjects: [],
            allProjects: [],
            dataView: {
                title: '开发动态',
                scrollX: 1000,
                columns: [
                    [ '时间', 'updatetime', { width: 160 } ],
                    [ '接口名称', 'name', { width: 120 } ],
                    [ '接口地址', 'url', { width: 220 } ],
                    [ '描述', 'description', { width: 400 } ],
                    [ '操作', 'id', {
                        width: 200,
                        customRender: (value, row) => {
                            return (
                                <div>
                                    <a-button type="primary" loading={row.loading} onClick={() => this.dataView.events.closeNotice(row)} style="margin-right:12px">关闭</a-button>
                                    <a-button type="primary" onClick={() => this.$router.push(`/project/1/api/${row.id}`)}>查看</a-button>
                                </div>
                            )
                        },
                    } ],
                ],
                dataSource (params) {
                    return {
                        page: params.page,
                        total: 2,
                        data: [
                            { id: '1', loading: false, updatetime: '2019/01/12 12:12', name: '使用账号登录', url: '/loginWithAccount', description: '接口字段已更新' },
                            { id: '2', loading: false, updatetime: '2019/01/12 12:12', name: '使用手机登录', url: '/loginWithMobile', description: '接口已就绪' },
                        ],
                    }
                },
                events: {
                    closeNotice (row) {
                        row.loading = true
                        console.info('关闭通知', row.id)

                        setTimeout(() => row.loading = false, 1000)
                    },
                },
            },


            createProjectDialog: {
                title: '创建项目',
                okButtonProps: {
                    props: {
                        loading: false,
                    },
                },
                data: {

                },
                onOpen: ({ data }, row) => {

                // data.row = row
                // data.remark = row.remark
                },
                onClose: () => {
                    this.createProjectForm.handle.resetFields()
                },
                submit: ({ data, okButtonProps }) => {
                    this.createProjectForm.validate((errors, values) => {
                        if (errors) {
                            return
                        }

                        okButtonProps.props.loading = true
                        this.$api.createProject(values)
                            .then(res => {
                                this.$message.success('操作成功')
                                this.createProjectDialog.close()
                                this.loadMyProject()
                                this.loadAllProject()
                            })
                            .finally(() => {
                                okButtonProps.props.loading = false
                            })
                    })
                },
                render: ({ data }) => {
                    return (
                        <div>
                            {true && <c-form option={this.createProjectForm} />}
                        </div>
                    )
                },
            },

            createProjectForm: {
                data: {
                    name: '',
                    description: '',
                },
                gridLayout: {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 17 },
                },
                fields: [
                    [ '项目名称', 'name', {
                        maxlength: 10,
                        rules: [
                            { required: true, message: '请输入项目名称' },
                        ],
                    } ],
                    [ '项目描述', 'description', {
                        maxlength: 40,
                    } ],
                ],
            },
        }
    },

    mounted () {
        for (let i = 0; i < 8; i++) {
            this.myProjects.push({
                id: `${i}`,
                title: `项目名称${i}`,
                description: '项目描述',
            })
            this.allProjects.push({
                id: `${i}`,
                title: `项目名称${i}`,
                description: '项目描述',
            })
        }
    },

    methods: {
        unfollowProject (row) {
            this.$message.success(`取消关注成功${row.id}`)
        },
        onfollowProject (row) {
            this.$message.success(`添加关注成功${row.id}`)
        },
    },
}
</script>
<style lang="less">
.view-home {
    margin: 20px;
}
</style>
