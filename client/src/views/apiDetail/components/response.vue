<template>
  <a-card title="响应配置" style="margin-top:10px">
    <!--<jsonsql-editor />-->


    <a-button slot="extra" type="primary" @click="() => editDialog.open()">
      编辑
    </a-button>
    <a-descriptions>
      <a-descriptions-item label="响应数据">
        <a-table :columns="responseData.columns" :data-source="responseData.dataSource" :pagination="false" />
      </a-descriptions-item>
    </a-descriptions>
    <c-dialog :option="editDialog" />
  </a-card>
</template>

<script>
import JsonsqlEditor from './JsonsqlEditor'
export default {
    components: {
        JsonsqlEditor,
    },
    data () {
        return {
            responseData: {
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
            editDialog: {
                title: '响应数据',
                width: 720,
                data: {
                    jsonsqlEditor: {
                        value: '',
                        onSave: (value) => {
                            this.editDialog.data.jsonsqlEditor.value = value

                            this.editDialog.submit()
                        },
                    },
                },
                onOpen: ({ data }, args) => {
                    data.jsonsqlEditor.value = `xxxx${Date.now()}`
                },
                onSubmit: ({ data, okButtonProps }) => {
                    console.info(data.jsonsqlEditor.value)
                },
                render: () => {
                    return (
                        <div>
                            <JsonsqlEditor option={this.editDialog.data.jsonsqlEditor}/>
                        </div>
                    )
                },
            },
        }
    },
}
</script>

<style>
</style>
