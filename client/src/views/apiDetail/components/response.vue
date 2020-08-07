<template>
  <a-card title="响应数据" style="margin-top:10px" class="detail-response">
    <!--<jsonsql-editor />-->


    <a-button slot="extra" type="primary" @click="() => editDialog.open()">
      编辑
    </a-button>
    <a-table
      :columns="responseData.columns"
      :row-class-name="responseData.rowClassName"
      :data-source="responseData.dataSource"
      :pagination="false"
    />
    <c-dialog :option="editDialog" />
  </a-card>
</template>

<script>
import JsonsqlEditor from './JsonsqlEditor'
export default {
    components: {
        // eslint-disable-next-line vue/no-unused-components
        JsonsqlEditor,
    },
    props: {
        bridge: Object,
    },
    data () {
        this.bridge.$bind(this)
        this.bridge.$mapState([ 'apiId', 'apiData' ])

        return {

            responseData: {
                rowClassName: (record, index) => {
                    if (!record) {
                        return ''
                    }

                    return ({
                        '-': 'state-remove',
                        '+': 'state-add',
                        '?': 'state-question',
                        '!': 'state-warn',
                    })[record.flag]
                },
                columns: [
                    {
                        title: '名称',
                        dataIndex: 'name',
                        key: 'name',
                        width: 300,
                    },
                    {
                        title: '类型',
                        dataIndex: 'types',
                        key: 'types',
                        width: 160,
                    },
                    {
                        title: '必选',
                        dataIndex: 'required',
                        key: 'required',
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
                        // width: 320,
                    },
                ],
                dataSource: [/*
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
                    { name: 'ddff', key: '2', type: 'String, Number', need: '是', defaultValue: '-', description: '字段描述666' },
                    { name: 'dfsd', key: '3', type: 'String, Number', need: '是', defaultValue: '-', description: '字段描述666' },
                    { name: 'sssssss', key: '4', type: 'String, Number', need: '是', defaultValue: '-', description: '字段描述666' },
                    { name: 'dddddddddddddd', key: '5', type: 'String, Number', need: '是', defaultValue: '-', description: '字段描述666' },
                */],
            },
            editDialog: {
                title: '响应数据',
                width: 800,
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
                    data.jsonsqlEditor.value = this.apiData.resData || ''
                },
                onSubmit: ({ data, okButtonProps }) => {
                    this.$api.editApi({ id: this.apiId, resData: data.jsonsqlEditor.value }).then(data => {
                        this.editDialog.close()
                        this.bridge.$emit('reloadApiData')
                    })
                },
                onClose: ({ data }) => {

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
    watch: {
        apiData () {
            this.responseData.dataSource = this.transformData(this.apiData.mockResDoc)
        },
    },

    methods: {
        transformData (data, parentKey = '') {
            const newData = this.$adapter.transform({
                key: [ (key) => `${parentKey}-${key}`, 'name' ],
                types: [
                    { $value: (value) => value.filter(item => item !== 'null') },
                    { $key: 'required', $value: (value) => value.includes('null') ? '否' : '是' },
                ],
                flag: true,
                $increase: { defaultValue: () => '-' },
                description: true,
                children: (value, { row }) => this.transformData(value, `${parentKey}-${row.key}`),
            }, data)

            //  console.info(newData)

            return newData
        },
    },
}
</script>

<style lang="less">
.detail-response{
    .state-remove{
       text-decoration: line-through;
       color:red;
    }
    .state-add{
        color:green;
    }
    .state-warn{
        color:tomato;
    }
    .state-question{
        color:violet;
    }
}
</style>
