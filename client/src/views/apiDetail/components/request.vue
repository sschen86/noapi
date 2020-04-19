<template>
  <a-card title="请求配置" style="margin-top:10px">
    <a-button slot="extra" type="primary" @click="() => editAPIRequestInfoDialog.open()">
      编辑
    </a-button>
    <a-descriptions>
      <a-descriptions-item label="请求方式">
        <a-tag color="green">
          GET
        </a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="请求格式" span="2">
        <a-tag color="red">
          application/json
        </a-tag>
      </a-descriptions-item>

      <a-descriptions-item label="请求参数">
        <a-table :columns="requestData.columns" :data-source="requestData.dataSource" :pagination="false" />
      </a-descriptions-item>
    </a-descriptions>

    <c-dialog :option="editAPIRequestInfoDialog" />
  </a-card>
</template>

<script>
export default {
    data () {
        return {
            requestData: {
                columns: [
                    {
                        title: '名称',
                        dataIndex: 'name',
                        key: 'name',
                        width: 300,
                    },
                    {
                        title: '类型',
                        dataIndex: 'type',
                        key: 'type',
                        width: 160,
                    },
                    {
                        title: '必选',
                        dataIndex: 'need',
                        key: 'need',
                        width: 60,
                    },
                    {
                        title: '默认值',
                        dataIndex: 'defaultValue',
                        width: 120,
                    },
                    {
                        title: '描述',
                        dataIndex: 'description',
                        width: 320,
                    },
                ],
                dataSource: [
                    {
                        name: 'mobile1373814',
                        type: 'String, Number',
                        need: '是',
                        defaultValue: '-',
                        description: '字段描述666',
                        key: '1',
                        children: [
                            {
                                name: 'esdsd',
                                type: 'String, Number',
                                need: '是',
                                defaultValue: '-',
                                description: '字段描述666',
                                key: '1-1',
                                children: [
                                    { key: '1-1-1', name: 'aaaaaaaaaaaaaaa', type: 'String, Number', need: '是', defaultValue: '-', description: '字段描述666' },
                                    {
                                        key: '1-1-2',
                                        name: 'cccccccc',
                                        type: 'String, Number',
                                        need: '是',
                                        defaultValue: '-',
                                        description: '字段描述666',

                                    },

                                ],
                            },
                            { key: '1-2', name: 'dsasd', type: 'String, Number', need: '是', defaultValue: '-', description: '字段描述666' },

                        ],
                    },
                    { name: 'ddff', type: 'String, Number', need: '是', defaultValue: '-', description: '字段描述666' },
                    { name: 'dfsd', type: 'String, Number', need: '是', defaultValue: '-', description: '字段描述666' },
                    { name: 'sssssss', type: 'String, Number', need: '是', defaultValue: '-', description: '字段描述666' },
                    { name: 'dddddddddddddd', type: 'String, Number', need: '是', defaultValue: '-', description: '字段描述666' },
                ],
            },
            editAPIRequestInfoDialog: {
                title: '修改请求信息',
                data: {
                    form: {
                        data: {
                            name: '',
                            path: '',
                            category: '',
                        },
                        gridLayout: {
                            labelCol: { span: 6 },
                            wrapperCol: { span: 17 },
                        },
                        fields: [
                            [ '接口名称', 'name', {
                                maxlength: 10,
                                rules: [
                                    { required: true, message: '请输入接口名称' },
                                ],
                            } ],
                            [ '接口路径', 'path', {
                                maxlength: 100,
                                rules: [
                                    { required: true, message: '请输入接口路径' },
                                ],
                            } ],
                            [ '接口分类', 'category', {
                                customRender: () => {
                                    return (<div>xxx</div>)
                                },
                            } ],
                        ],
                    },
                },
                onOpen: ({ data }, args) => {

                },
                submit: ({ data, okButtonProps }) => {
                    data.form.validate((errors, values) => {
                        if (errors) {
                            return
                        }
                        console.info({ values })
                    })
                },
                render: () => {
                    return (
                        <div><c-form option={this.editAPIRequestInfoDialog.data.form}/></div>
                    )
                },
            },
        }
    },
}
</script>

<style>
</style>
