<template>
  <a-layout-sider
    class="project-sidebar"
    theme="light"
    width="360"
    :style="{ borderRight: '1px solid #d9d9d9', overflowY: 'scroll', overflowX: 'hidden', position: 'fixed', top: sidebarTop,bottom: 0, left: 0 }"
  >
    <div style="padding:12px">
      <h3 style="line-height:32px">
        项目名称777

        <a-button type="primary" style="float:right" @click="() => projectSettingDialog.open()">
          项目设置
        </a-button>
        <a-button type="primary" style="float:right;margin-right:8px" @click="() => projectAddCategoryDialog.open()">
          添加分类
        </a-button>
      </h3>
      <a-input style="display:none" placeholder="搜索接口" />
    </div>
    <a-directory-tree :tree-data="treeData" />

    <c-dialog :option="projectAddCategoryDialog" />
    <c-dialog :option="projectSettingDialog" />
  </a-layout-sider>
</template>

<script>
export default {
    data () {
        return {
            sidebarTop: '65px',
            rawTreeData: [],
            projectAddCategoryDialog: {
                title: '项目设置',
                okButtonProps: {
                    props: {
                        loading: false,
                    },
                },
                data: {
                    form: {
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
                },
                onOpen: ({ data }, row) => {
                    data.form.data.name = '项目名称'
                    data.form.data.description = '项目描述'
                },
                onClose: () => {

                },
                submit: ({ data, okButtonProps }) => {
                    return
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
                            <c-form option={data.form}/>
                        </div>
                    )
                },
            },
            projectSettingDialog: {
                title: '项目设置',
                okButtonProps: {
                    props: {
                        loading: false,
                    },
                },
                data: {
                    form: {
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
                },
                onOpen: ({ data }, row) => {
                    data.form.data.name = '项目名称'
                    data.form.data.description = '项目描述'
                },
                onClose: () => {

                },
                submit: ({ data, okButtonProps }) => {
                    return
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
                            <c-form option={data.form}/>
                        </div>
                    )
                },
            },
        }
    },
    computed: {
        treeData (oldValue) {
            const titleFactory = (title, { row: { id, isLeaf } }) => {
                const titleType = isLeaf ? 'api' : id ? 'cat2' : 'cat1'

                let titleContent

                if (titleType === 'api') {
                    titleContent = (
                        <router-link to={{ path: '/project/xxx/api/xxx' }}>
                            {title}
                            <span class="btns">
                                <a-tooltip placement="top">
                                    <template slot="title">
                                        <span>删除接口</span>
                                    </template>
                                    <span onClick={
                                        (e) => {
                                            this.openDeleteAPIDialog(id)
                                            e.stopPropagation()
                                            e.preventDefault()
                                        }
                                    } ><a-icon type="delete" /></span>
                                </a-tooltip>
                            </span>
                        </router-link>
                    )
                } else {
                    titleContent = (
                        <span>
                            {title}
                            <span class="btns">
                                <a-tooltip placement="top">
                                    <template slot="title">
                                        <span>添加接口</span>
                                    </template>
                                    <span onClick={
                                        (e) => {
                                            this.openCreateAPIDialog(id)
                                            e.stopPropagation()
                                        }
                                    } ><a-icon type="plus-circle"/></span>
                                </a-tooltip>
                                {
                                    titleType === 'cat1' && <a-tooltip placement="top">
                                        <template slot="title">
                                            <span>添加子分类</span>
                                        </template>
                                        <span onClick={
                                            (e) => {
                                                this.openCreateCatDialog(id)
                                                e.stopPropagation()
                                            }
                                        } ><a-icon type="plus" /></span>
                                    </a-tooltip>
                                }

                                <a-tooltip placement="top">
                                    <template slot="title">
                                        <span>修改分类</span>
                                    </template>
                                    <span onClick={
                                        (e) => {
                                            this.openEditCatDialog(id)
                                            e.stopPropagation()
                                        }
                                    } ><a-icon type="edit" /></span>
                                </a-tooltip>
                                <a-tooltip placement="top">
                                    <template slot="title">
                                        <span>删除分类</span>
                                    </template>
                                    <span onClick={
                                        (e) => {
                                            this.openDeleteCatDialog(id)
                                            e.stopPropagation()
                                        }
                                    } ><a-icon type="delete" /></span>
                                </a-tooltip>
                            </span>
                        </span>
                    )
                }
                // console.info({ titleContent })
                return () => (
                    <div class={`${titleType}-title`}>
                        {titleContent}
                    </div>
                )
            }
            const treeData = this.$adapter.transform({
                id: 'key',
                title: titleFactory,
                children: {
                    id: 'key',
                    title: titleFactory,
                    children: {
                        id: 'key',
                        isLeaf: true,
                        title: titleFactory,
                    },
                },
            }, this.rawTreeData)

            // console.info({ treeData })
            return treeData
        },
    },
    beforeMount () {
        this.rawTreeData = [
            {
                id: '1',
                title: '分类1',
                children: [
                    {
                        id: '1-1',
                        title: '分类1-1',
                        children: [
                            {
                                id: '1-1-1',
                                isLeaf: true,
                                title: '接口1-1-1',
                            },
                            {
                                id: '1-1-2',
                                isLeaf: true,
                                title: '接口1-1-2',
                            },
                            {
                                id: '1-1-3',
                                isLeaf: true,
                                title: '接口1-1-3',
                            },
                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },
                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },

                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },
                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },
                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },
                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },
                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },
                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },
                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },
                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },
                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },
                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },
                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },
                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },
                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },
                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },
                            {
                                id: '1-1-4',
                                isLeaf: true,
                                title: '接口1-1-4',
                            },
                        ],
                    },
                ],
            },
            {
                id: '2',
                title: '分类2',
            },
        ]
    },
    mounted () {
        window.addEventListener('scroll', this.listenSidebarStyle)
    },

    beforeDestroy () {
        window.removeEventListener('scroll', this.listenSidebarStyle)
    },

    methods: {
        listenSidebarStyle (e) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            if (scrollTop > 65) {
                this.sidebarTop = 0
            } else {
                this.sidebarTop = `${66 - scrollTop}px`
            }
        },
        openCreateAPIDialog (id) {
            console.info({ openCreateAPIDialog: id })
        },
        openCreateCatDialog (id) {
            console.info({ openCreateCatDialog: id })
        },
        openEditCatDialog (id) {
            console.info({ openEditCatDialog: id })
        },
        openDeleteCatDialog (id) {
            console.info({ openDeleteCatDialog: id })
        },
        openDeleteAPIDialog (id) {
            console.info({ openDeleteAPIDialog: id })
        },
    },
}
</script>

<style lang="less">
.project-sidebar {
    .ant-tree.ant-tree-directory
        > li.ant-tree-treenode-selected
        > span.ant-tree-node-content-wrapper::before,
    .ant-tree.ant-tree-directory
        .ant-tree-child-tree
        > li.ant-tree-treenode-selected
        > span.ant-tree-node-content-wrapper::before {
        background-color: #e6f7ff;
    }
    .ant-tree.ant-tree-directory
        > li
        span.ant-tree-node-content-wrapper.ant-tree-node-selected,
    .ant-tree.ant-tree-directory
        .ant-tree-child-tree
        > li
        span.ant-tree-node-content-wrapper.ant-tree-node-selected {
        color: #666;
    }
    .cat1-title {
        display: inline-block;
        width: 294px;

        .btns {
            display: none;
            float: right;
            span {
                margin-right: 6px;
            }
        }
        &:hover {
            .btns {
                display: inline;
            }
        }
    }
    .cat2-title {
        display: inline-block;
        width: 276px;

        .btns {
            display: none;
            float: right;
            span {
                margin-right: 6px;
            }
        }
        &:hover {
            .btns {
                display: inline;
            }
        }
    }
    .api-title {
        display: inline-block;
        width: 256px;

        .btns {
            display: none;
            float: right;
            span {
                margin-right: 6px;
            }
        }
        &:hover {
            .btns {
                display: inline;
            }
        }
    }
}
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
