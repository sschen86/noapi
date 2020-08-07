<template>
  <a-layout-sider
    class="project-sidebar"
    theme="light"
    width="360"
    :style="{ borderRight: '1px solid #d9d9d9', overflowY: 'scroll', overflowX: 'hidden', position: 'fixed', top: sidebarTop,bottom: 0, left: 0 }"
  >
    <div style="padding:12px">
      <h3 style="line-height:32px">
        {{ projectName }}
        <a-button type="primary" style="float:right" @click="() => projectSettingDialog.open()">
          项目设置
        </a-button>
        <a-button type="primary" style="float:right;margin-right:8px" @click="() => projectAddCategoryDialog.open()">
          添加分类
        </a-button>
      </h3>
      <a-input style="display:none" placeholder="搜索接口" />
    </div>
    <a-directory-tree
      :tree-data="treeData"
      draggable
      @dragenter="onTreeItemDragEnter"
      @drop="onTreeItemDrop"
    />

    <c-dialog :option="projectAddCategoryDialog" />
    <c-dialog :option="projectSettingDialog" />
    <c-dialog :option="categorySettingDialog" />
    <c-dialog :option="createApiDialog" />
  </a-layout-sider>
</template>

<script>
export default {
    data () {
        return {
            projectId: this.$route.params.projectId,
            projectName: '项目加载中...',
            projectDescription: '',
            projectApis: [],

            sidebarTop: '65px',
            rawCategorys: [],
            projectAddCategoryDialog: {
                title: '添加分类',
                okButtonProps: {
                    props: {
                        loading: false,
                    },
                },
                data: {
                    form: {
                        data: {
                            name: '',
                        },
                        gridLayout: {
                            labelCol: { span: 6 },
                            wrapperCol: { span: 17 },
                        },
                        fields: [
                            [ '分类名称', 'name', {
                                maxlength: 10,
                                rules: [
                                    { required: true, message: '请输入分类名称' },
                                ],
                            } ],
                        ],
                    },
                },
                onOpen: ({ data }, parentId) => {
                    data.form.data.name = ''
                    data.form.data.parentId = parentId
                },
                onClose: ({ data }) => {
                    data.form.handle.resetFields()
                },
                onSubmit: ({ data, okButtonProps }) => {
                    data.form.handle.validateFields((errors, values) => {
                        if (errors) {
                            return
                        }
                        okButtonProps.props.loading = true
                        this.$api.createCategory({ projectId: this.projectId, parentId: data.form.data.parentId, name: values.name })
                            .then(res => {
                                this.$message.success('操作成功')
                                this.projectAddCategoryDialog.close()
                                this.getProjectCategorys()
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
                    data.form.data.name = this.projectName
                    data.form.data.description = this.projectDescription
                },
                onClose: () => {

                },
                onSubmit: ({ data, okButtonProps }) => {
                    data.form.handle.validateFields((errors, values) => {
                        if (errors) {
                            return
                        }

                        okButtonProps.props.loading = true
                        this.$api.eidtProject({ ...values, id: this.projectId })
                            .then(() => {
                                this.$message.success('操作成功')
                                this.projectSettingDialog.close()
                                this.getProject()
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
            categorySettingDialog: {
                title: '分类设置',
                okButtonProps: {
                    props: {
                        loading: false,
                    },
                },
                data: {
                    form: {
                        data: {
                            name: '',
                            id: '',
                        },
                        gridLayout: {
                            labelCol: { span: 6 },
                            wrapperCol: { span: 17 },
                        },
                        fields: [
                            [ '分类名称', 'name', {
                                maxlength: 10,
                                rules: [
                                    { required: true, message: '请输入分类名称' },
                                ],
                            } ],
                        ],
                    },
                },
                onOpen: ({ data }, { name, id }) => {
                    data.form.data.name = name
                    data.form.data.id = id
                },
                onClose: ({ data }) => {
                    data.form.handle.resetFields()
                },
                onSubmit: ({ data, okButtonProps }) => {
                    data.form.handle.validateFields((errors, values) => {
                        if (errors) {
                            return
                        }

                        okButtonProps.props.loading = true
                        this.$api.editCategory({ ...values, id: data.form.data.id })
                            .then(() => {
                                this.$message.success('操作成功')
                                this.categorySettingDialog.close()
                                this.getProjectCategorys()
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
            createApiDialog: {
                title: '创建API',
                okButtonProps: {
                    props: {
                        loading: false,
                    },
                },
                data: {
                    form: {
                        data: {
                            projectId: null,
                            name: '',
                            path: '',
                            method: 0,
                            // reqDataFormat: 0,
                            categoryId: null,
                        },
                        gridLayout: {
                            labelCol: { span: 6 },
                            wrapperCol: { span: 17 },
                        },
                        fields: [
                            [ '接口名称', 'name', {
                                maxlength: 20,
                                rules: [
                                    { required: true, message: '请输入接口名称' },
                                ],
                            } ],
                            [ '接口地址', 'path', {
                                maxlength: 64,
                                rules: [
                                    { required: true, message: '请输入接口地址' },
                                ],
                            } ],
                            [ '请求方式', 'method', {
                                type: 'select',
                                options: [
                                    { title: 'GET', value: 0 },
                                    { title: 'POST', value: 1 },
                                ],
                                rules: [
                                    { required: true, message: '请选择请求方式' },
                                ],
                            } ],
                            /*
                            [ '请求格式', 'reqDataFormat', {
                                type: 'select',
                                options: [
                                    { title: 'application/json', value: 0 },
                                    { title: 'application/x-www-form-urlencoded', value: 1 },
                                    { title: 'multipart/form-data', value: 2 },
                                ],
                            } ], */
                        ],

                    },
                },
                onOpen: ({ data }, categoryId) => {
                    Object.assign(data.form.data, {
                        projectId: this.projectId,
                        categoryId,
                        name: '',
                        path: '',
                        method: 0,
                        reqDataFormat: 0,
                    })
                },
                onClose: ({ data }) => {
                    data.form.handle.resetFields()
                },
                onSubmit: ({ data, okButtonProps }) => {
                    data.form.handle.validateFields((errors, values) => {
                        if (errors) {
                            return
                        }

                        values.path = values.path.replace(/^\/+/, '')

                        okButtonProps.props.loading = true
                        this.$api.createApi({ ...data.form.data, ...values })
                            .then(res => {
                                this.$message.success('操作成功')
                                this.createApiDialog.close()
                                this.getProjectApis()
                            })
                            .finally(() => {
                                okButtonProps.props.loading = false
                            })
                    })
                },
                render: ({ data }) => {
                    return (
                        <div>
                            <c-form option={data.form} />
                        </div>
                    )
                },
            },
        }
    },
    computed: {
        rawTreeData () {
            const categorys = []
            const parentCategorys = {}
            const allCategorys = {}
            this.rawCategorys.forEach(category => {
                const { parentId } = category
                if (parentId) {
                    parentCategorys[parentId] = parentCategorys[parentId] || []
                    parentCategorys[parentId].push(category)
                } else {
                    categorys.push(category)
                }

                // 用于挂载API的分类索引
                if (!allCategorys[category.id]) {
                    allCategorys[category.id] = category
                }
            })

            this.rawCategorys.forEach(category => {
                category.children = parentCategorys[category.id] || []
            })


            const unCategoryApis = []
            const allCategorysIds = Object.keys(allCategorys).map(item => Number(item))

            this.projectApis.forEach(api => {
                const { parentId } = api
                if (allCategorysIds.includes(parentId)) {
                    allCategorys[parentId].children.push(api)
                    api.key = `${parentId}-${api.id}`
                } else {
                    unCategoryApis.push(api)
                    api.key = `#${api.id}`
                }
            })

            categorys.unshift({
                title: '未分类',
                key: '#',
                children: unCategoryApis,
            })

            // console.info({ categorys })

            return categorys
        },
        treeData () {
            const titleFactory = (title, { row: { key, id, parentId, isLeaf } }) => {
                const titleType = isLeaf ? 'api' : parentId ? 'cat2' : 'cat1'

                let titleContent

                if (titleType === 'api') {
                    titleContent = (
                        <router-link to={{ path: `/project/${this.projectId}/api/${id}` }}>
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
                                    key !== '#' && titleType === 'cat1' && <a-tooltip placement="top">
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
                                {key !== '#' && (
                                    <a-tooltip placement="top">
                                        <template slot="title">
                                            <span>修改分类</span>
                                        </template>
                                        <span onClick={
                                            (e) => {
                                                this.openEditCatDialog({ id, name: title })
                                                e.stopPropagation()
                                            }
                                        } ><a-icon type="edit" /></span>
                                    </a-tooltip>
                                )}
                                {key !== '#' && (
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
                                )}
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
                key: true,
                isLeaf: true,
                title: titleFactory,
                children: {
                    key: true,
                    isLeaf: true,
                    title: titleFactory,
                    children: {
                        key: true,
                        isLeaf: true,
                        title: titleFactory,
                    },
                },
            }, this.rawTreeData)

            // console.info({ treeData })
            return treeData
        },
    },
    created () {
        this.getProject()
        this.getProjectCategorys()
        this.getProjectApis()
        this.$bridge.listen('API_UPDATE', () => {
            this.getProjectApis()
        }, this)
    },
    mounted () {
        window.addEventListener('scroll', this.autoSidebarPosition)
        this.autoSidebarPosition()
    },

    beforeDestroy () {
        window.removeEventListener('scroll', this.autoSidebarPosition)
        this.$bridge.leave(this)
    },

    methods: {
        // 数据获取
        getProject () {
            this.$api.getProject({ id: this.projectId }).then((data) => {
                this.projectName = data.name
                this.projectDescription = data.description
            })
        },

        getProjectCategorys () {
            this.$api.getProjectCategorys({ projectId: this.projectId }).then(data => {
                this.rawCategorys = data
            })
        },

        getProjectApis () {
            this.$api.getProjectApis({ projectId: this.projectId }).then(data => {
                this.projectApis = data
            })
        },

        // ui控制
        autoSidebarPosition (e) {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            if (scrollTop > 65) {
                this.sidebarTop = 0
            } else {
                this.sidebarTop = `${66 - scrollTop}px`
            }
        },

        // 操作行为
        openCreateAPIDialog (categoryId) {
            this.createApiDialog.open(categoryId)
        },
        openCreateCatDialog (parentId) {
            this.projectAddCategoryDialog.open(parentId)
        },
        openEditCatDialog (data) {
            this.categorySettingDialog.open(data)
        },
        openDeleteCatDialog (id) {
            this.$confirm({
                title: '确定删除该分类？',
                content: '删除分类不会删除存在的接口',
                onOk: () => {
                    return this.$api.deleteCategory({ projectId: this.projectId, id }).then(() => {
                        this.getProjectCategorys()
                    })
                },
                onCancel () {},
            })
        },
        openDeleteAPIDialog (id) {
            this.$confirm({
                title: '确定删除该接口？',
                content: '注意：删除后不可恢复！',
                onOk: () => {
                    return this.$api.deleteApi({ id }).then(() => {
                        this.getProjectApis()
                    })
                },
                onCancel () {},
            })
        },

        onTreeItemDragEnter (...args) {

        },
        onTreeItemDrop (info) {
            const dropKey = String(info.node.eventKey)
            const dragKey = String(info.dragNode.eventKey)

            // 分类类目不能移动到未分类
            if (dropKey.indexOf('#') !== -1 && /^(\d+)$/.test(dragKey)) {
                return
            }

            this.$api.moveAPI({ projectId: this.projectId, selfId: dragKey, targetId: dropKey }).then(() => {
                this.getProjectApis()
                this.getProjectCategorys()
            })
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
