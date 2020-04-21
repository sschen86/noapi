<script>
export default {
    name: 'CForm',
    props: {
        option: {
            type: Object,
            required: true,
        },
    },
    computed: {
        renderData () {
            return this.option.data
        },
        renderFields () {
            const { data, fields } = this.option
            const renderFields = []
            fields.forEach(item => {
                let label, name, option
                if (Array.isArray(item)) {
                    [ label, name, option = {} ] = item
                } else {
                    ({ label, name } = item)
                    option = item
                }

                const newOption = {
                    type: option.type || 'input',
                    disabled: option.disabled,
                    maxlength: option.maxlength,
                    required: option.required,
                    trim: option.trim,
                }

                newOption.onChange = option.onChange || (() => {})

                if (option.data) {
                    newOption.data = option.data
                }

                if (option.options || option.type === 'radio' || option.type === 'checkbox') {
                    newOption.options = option.options || []
                    // ...
                }

                // 自定义配置项
                if (option.customOption) {
                    newOption.customOption = option.customOption
                }

                if (option.customRender) {
                    newOption.type = 'custom'
                    newOption.customRender = () => {
                        return option.customRender(formField.value, formField, this.option)
                    }
                }

                if (option.width) {
                    newOption.width = option.width
                }

                const decorator = [
                    name,
                    {
                        rules: option.rules ? option.rules.slice() : [],
                        ...(option.decorator || {}),
                    },
                ]

                if (typeof data[name] !== 'undefined') {
                    decorator[1].initialValue = data[name]
                }

                const formField = {
                    label,
                    name,
                    decorator,
                    ...newOption,
                    value: data[name] || '',
                }


                // console.info('###', option.created)

                // created用于异步初始化完成后更新选项
                if (typeof option.created === 'function') {
                    option.created({
                        option: formField,
                        update: (key, value) => {
                            formField[key] = value
                        },
                    })
                }


                // 这里可以接受一个boolean参数,或者返回一个动态计算的function,并返回boolean
                const hidden = (typeof option.hidden === 'function') ? option.hidden(formField.value, formField, this.option) : option.hidden
                if (!hidden) {
                    renderFields.push(formField)
                }
            })
            return renderFields
        },
    },


    created () {
        const options = this.option.options || {}
        const form = this.option.handle = this.form = this.$form.createForm(this, options)
        this.option.validate = (callback, option = {}) => {
            if (!option.untrim) {
                const trimValues = {}
                this.renderFields.forEach((field) => {
                    const { name, trim } = field
                    if (!name || trim === false) {
                        return
                    }
                    if (field.type === 'input' || trim === true) {
                        const value = form.getFieldValue(name)
                        if (typeof value === 'string') {
                            trimValues[name] = value.trim()
                        }
                    }
                })
                form.setFieldsValue(trimValues)
            }

            form[option.scroll === false ? 'validateFields' : 'validateFieldsAndScroll'](callback)
        }

        const { gridLayout } = this.option

        if (gridLayout) {
            this.labelCol = gridLayout.labelCol || { span: 6 }
            this.wrapperCol = gridLayout.wrapperCol || { span: 16 }
        }
    },
    methods: {

    },

    render () {
        return (
            <a-form class="common-form" form={this.form} >
                {
                    this.renderFields.map((item) => {
                        let content


                        if (item.type === 'input') {
                            content = (<a-input maxLength={item.maxlength ? item.maxlength : undefined} v-decorator={item.decorator} disabled={typeof item.disabled === 'function' ? item.disabled() : item.disabled} />)
                        } else if (item.type === 'radio') {
                            content = (<a-radio-group v-decorator={item.decorator} disabled={typeof item.disabled === 'function' ? item.disabled() : item.disabled} options={item.options} />)
                        } else if (item.type === 'checkbox') {
                            content = (<a-checkbox-group v-decorator={item.decorator}disabled={typeof item.disabled === 'function' ? item.disabled() : item.disabled} options={item.options} />)
                        } else if (item.type === 'custom') {
                            content = item.customRender(item.decorator[1].initialValue, item)
                        } else if (item.type === 'value') {
                            content = (<div>{item.value}</div>)
                        } else if (item.type === 'select') {
                            content = (<a-select v-decorator={item.decorator} options={item.options} />)
                        }
                        return (
                            <a-form-item label={item.label} colon={false} required={item.required} labelCol={this.labelCol} wrapperCol={this.wrapperCol}>
                                <div style={`width:${item.width ? `${item.width}px` : 'auto'}`}>
                                    {content}
                                </div>
                            </a-form-item>
                        )
                    })
                }

            </a-form>
        )
    },

}
</script>
