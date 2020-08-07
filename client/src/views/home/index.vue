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
            <a-list-item slot="renderItem" slot-scope="project">
              <a-list-item-meta :description="project.description">
                <router-link slot="title" :to="{ path: '/project/' + project.id }">
                  {{ project.name }}
                </router-link>
                <a-avatar
                  slot="avatar"
                  src="https://img.alicdn.com/tfs/TB1SFZAvQL0gK0jSZFAXXcA9pXa-200-200.png"
                />
              </a-list-item-meta>
              <div>
                <a-button type="danger" @click="unfollowProject(project)">
                  取消关注
                </a-button>
              </div>
            </a-list-item>
          </a-list>
        </a-card>
      </a-col>
      <a-col :span="12">
        <a-card title="全部项目">
          <a-list item-layout="horizontal" :data-source="allProjects">
            <a-list-item slot="renderItem" slot-scope="project">
              <a-list-item-meta :description="project.description">
                <a slot="title" href="https://www.antdv.com/">{{ project.name }}</a>
                <a-avatar
                  slot="avatar"
                  src="https://img.alicdn.com/tfs/TB1SFZAvQL0gK0jSZFAXXcA9pXa-200-200.png"
                />
              </a-list-item-meta>
              <div>
                <a-button v-if="project.isFollow" type="danger" @click="unfollowProject(project)">
                  取消关注
                </a-button>
                <a-button v-else type="primary" @click="onfollowProject(project)">
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
            allProjectsOrigin: [],
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
                onClose: () => {
                    this.createProjectForm.handle.resetFields()
                },
                onSubmit: ({ data, okButtonProps }) => {
                    this.createProjectForm.validate((errors, values) => {
                        if (errors) {
                            return
                        }

                        okButtonProps.props.loading = true
                        this.$api.createProject(values)
                            .then(res => {
                                this.$message.success('操作成功')
                                this.createProjectDialog.close()
                                this.getMyProject()
                                this.getAllProjects()
                            })
                            .finally(() => {
                                okButtonProps.props.loading = false
                            })
                    })
                },
                render: () => {
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
    computed: {
        allProjects () {
            const myProjectIds = this.myProjects.map(project => project.id)
            return this.allProjectsOrigin.map(project => {
                project.isFollow = myProjectIds.includes(project.id)
                return project
            })
        },
    },

    mounted () {
        this.getMyProject()
        this.getAllProjects()
    },

    methods: {
        getMyProject () {
            this.$api.getMyProjects().then((data) => {
                this.myProjects = data
            })
        },
        getAllProjects () {
            this.$api.getAllProjects().then((data) => {
                this.allProjectsOrigin = data
            })
        },

        unfollowProject (row) {
            this.$api.removeProjectFavorite({ id: row.id }).then(() => {
                this.$message.success(`取消关注成功${row.id}`)
                this.getMyProject()
            })
        },
        onfollowProject (row) {
            this.$api.addProjectFavorite({ id: row.id }).then(() => {
                this.$message.success(`添加关注成功${row.id}`)
                this.getMyProject()
            })
        },
    },
}
</script>
<style lang="less">
.view-home {
    margin: 20px;
}
</style>
