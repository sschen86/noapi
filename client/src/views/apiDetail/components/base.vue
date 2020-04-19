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
      <a-descriptions-item label="接口名称">
        使用手机号码登录
      </a-descriptions-item>
      <a-descriptions-item label="接口地址" span="2">
        /jjj/loginWithMobile
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
    </a-descriptions>

    <c-dialog :option="mockDialog" />
    <c-dialog :option="editAPIBaseInfoDialog" />
  </a-card>
</template>

<script>
import JsonEditor from './JsonEditor'
export default {
    data () {
        return {

            mockDialog: {
                title: 'MOCK接口',
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
                        readOnly: true,
                    },
                },
                onOpen ({ data }) {
                    data.requestDataEditor.value = `${Date.now()}`
                    data.responseDataEditor.value = 0
                },
                onSubmit ({ okButtonProps, data }) {
                    okButtonProps.props.loading = true
                    data.responseDataEditor.value = 1

                    console.info(data.requestDataEditor.value)


                    /* this.$mockSend({
                        method:'',
                        path:'/...',
                        data: '...'
                    }).then((res)=>{
                        data.responseDataEditor.value = res
                    })
                    */
                },
                render: ({ data }) => {
                    const { value } = data.responseDataEditor
                    const responseJsx = value === 0
                        ? '等待请求...' : value === 1
                            ? '数据请求中...' : <JsonEditor option={data.responseDataEditor}/>
                    return (
                        <div>
                            <h4>请求参数：</h4>
                            <JsonEditor option={data.requestDataEditor}/>
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
                        <div><c-form option={this.editAPIBaseInfoDialog.data.form}/></div>
                    )
                },
            },
        }
    },
}
</script>

<style>
</style>
