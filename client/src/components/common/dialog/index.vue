<script>
// import props from '@/utils/vue-props'
export default {
    props: {
        option: {
            type: Object,
            required: true,
        },
    },
    /* props: props.validator({
        option: {
            required: true,
            children: {
                submit: {
                    type: Function,
                },
                render: {
                    type: Function,
                    required: true,
                },
                className: {
                    type: String,
                },
                visible: {
                    type: Boolean,
                },
                onOpen: {
                    type: Function,
                },
                onClose: {
                    type: Function,
                },
                okButtonProps: {
                    type: Object,
                },
                props: {
                    type: Object,
                },
                width: {
                    type: Number,
                },
            },
        },
    }),
    */

    data () {
        return {
            visible: false,
        }
    },

    created () {
        const { option } = this

        this.visible = option.visible || false
        option.open = (...args) => {
            this.visible = true
            if (option.onOpen) {
                option.onOpen(option, ...args)
            }
        }
        option.close = (...args) => {
            this.visible = false
            if (option.onClose) {
                option.onClose(option, ...args)
            }
        }
        option.submit = () => {
            option.onSubmit && option.onSubmit(option)
        }
    },

    render () {
        const { option } = this
        return (
            <a-modal
                props={option.props}
                class={option.className}
                title={option.title}
                v-model={this.visible}
                onOk={() => option.onSubmit && option.onSubmit(option)}
                onCancel={() => { option.onClose && option.onClose(option) }}
                okButtonProps={option.okButtonProps}
                footer={option.footer === false ? null : undefined}
                width={option.width || undefined}
            >
                {option.render.call(this, option)}
            </a-modal>
        )
    },

}
</script>
