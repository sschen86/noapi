<template>
  <a-card title="基础信息">
    <a-button
      slot="extra"
      type="primary"
      style="margin-right:8px;"
      @click="() => mockDialog.open()"
    >
      MOCK接口
    </a-button>
    <a-button slot="extra" type="primary" @click="() => editAPIBaseInfoDialog.open()">
      编辑
    </a-button>
    <a-descriptions>
      <a-descriptions-item label="接口名称" span="3">
        {{ apiData.name }}
      </a-descriptions-item>
      <a-descriptions-item label="接口地址" span="3">
        {{ apiData.path }}
      </a-descriptions-item>
      <a-descriptions-item label="请求方式">
        {{ apiData.methodText }}
      </a-descriptions-item>
      <a-descriptions-item label="接口描述">
        {{ apiData.description || '-' }}
      </a-descriptions-item>
      <!--
      <a-descriptions-item label="请求格式" span="2">
        <a-tag color="red">
          application/json
        </a-tag>
      </a-descriptions-item>

      <a-descriptions-item label="接口分类">
        用户接口/登陆相关
      </a-descriptions-item>
      <a-descriptions-item label="更新时间">
        2019/12/12 12:12
      </a-descriptions-item>
      <a-descriptions-item label="更新者">
        admin
      </a-descriptions-item>
      -->
    </a-descriptions>

    <c-dialog :option="mockDialog" />
    <c-dialog :option="editAPIBaseInfoDialog" />
  </a-card>
</template>

<script>
import JsonEditor from './JsonEditor'
export default {
    props: {
        bridge: Object,
    },
    data () {
        this.bridge.$bind(this)
        this.bridge.$mapState([ 'projectId', 'apiId', 'apiData' ])
        return {
            mockDialog: {
                title: 'MOCK接口',
                width: 800,
                props: {
                    okText: '发起请求',
                },
                okButtonProps: {
                    props: {
                        loading: false,
                    },
                },
                data: {
                    requestDataEditor: {
                        value: '',
                        height: 120,
                    },
                    responseDataEditor: {
                        value: 0,
                        height: 260,
                        // readOnly: true,
                        format: true,
                    },
                },
                onOpen: ({ data }) => {
                    data.requestDataEditor.value = JSON.stringify(
                        this.apiData.mockReqData,
                    )
                    data.responseDataEditor.value = 0
                },
                onSubmit: ({ okButtonProps, data }) => {
                    okButtonProps.props.loading = true
                    data.responseDataEditor.value = 1
                    this.$mockapi
                        .send(JSON.parse(data.requestDataEditor.value), {
                            method: this.apiData.methodText,
                            url: this.apiData.path,
                        })
                        .then((resData) => {
                            data.responseDataEditor.value = JSON.stringify(resData)
                        })
                        .finally(() => {
                            okButtonProps.props.loading = false
                        })
                },
                render: ({ data }) => {
                    const { value } = data.responseDataEditor
                    const responseJsx =
            value === 0 ? (
                <div style="height:260px">等待请求...</div>
            ) : value === 1 ? (
                <div style="height:260px">数据请求中... </div>
            ) : (
                <JsonEditor option={data.responseDataEditor} />
            )
                    return (
                        <div>
                            <h4>请求参数：</h4>
                            <JsonEditor option={data.requestDataEditor} />
                            <h4 style="margin-top:8px">响应数据：</h4>
                            {responseJsx}
                        </div>
                    )
                },
            },
            editAPIBaseInfoDialog: {
                title: '修改基础信息',
                data: {
                    form: {
                        data: {
                            name: '',
                            path: '',
                            method: '',
                            description: '',
                        },
                        gridLayout: {
                            labelCol: { span: 6 },
                            wrapperCol: { span: 17 },
                        },
                        fields: [
                            [
                                '接口名称',
                                'name',
                                {
                                    maxlength: 20,
                                    rules: [ { required: true, message: '请输入接口名称' } ],
                                },
                            ],
                            [
                                '接口路径',
                                'path',
                                {
                                    maxlength: 100,
                                    rules: [ { required: true, message: '请输入接口路径' } ],
                                },
                            ],
                            [
                                '请求方式',
                                'method',
                                {
                                    type: 'select',
                                    options: [
                                        { title: 'GET', value: 0 },
                                        { title: 'POST', value: 1 },
                                    ],
                                    rules: [ { required: true, message: '请选择请求方式' } ],
                                },
                            ],
                            [
                                '接口描述', 'description', {
                                    maxlength: 256,
                                    customRender: (value, { decorator }) => {
                                        return (<a-textarea maxLength={256} v-decorator={decorator}></a-textarea>)
                                    },
                                },
                            ],
                        ],
                    },
                },
                onOpen: ({ data }, args) => {
                    Object.assign(data.form.data, this.apiData)
                },
                onSubmit: ({ data, okButtonProps }) => {
                    data.form.handle.validateFields((errors, values) => {
                        if (errors) {
                            return
                        }
                        values.path = values.path.replace(/^\/+/, '')
                        this.$api.editApi({ ...values, id: this.apiId }).then((data) => {
                            this.editAPIBaseInfoDialog.close()
                            this.bridge.$emit('reloadApiData')
                        })
                    })
                },
                onClose: ({ data }) => {
                    data.form.handle.resetFields()
                },
                render: () => {
                    return (
                        <div>
                            <c-form option={this.editAPIBaseInfoDialog.data.form} />
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
