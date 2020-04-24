

<script>
import * as monaco from 'monaco-editor'
export default {
    props: {
        option: Object,
    },
    data () {
        return {
            height: 305,
            value: this.option.value,
        }
    },
    watch: {
        'option.value' (value) {
            if (value !== this.value) {
                this.editor.setValue(this.value = value)
                if (this.option.format) {
                    this.editor.trigger('格式化json', 'editor.action.formatDocument')
                }
            }
        },
    },
    created () {
        this.height = this.option.height || this.height
        this.onSave = function (value) {
            this.option.onSave && this.option.onSave(value)
        }
    },
    mounted () {
        const editor = this.editor = monaco.editor.create(this.$refs.editorBox, {
            value: this.value,
            theme: 'vs-dark',
            language: 'json',
            scrollBeyondLastLine: false,
            readOnly: !!this.option.readOnly,
            // lineNumbers: 'off',
        })
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => this.onSave(editor.getValue()))
        editor.onDidChangeModelContent(e => {
            this.value = this.option.value = editor.getValue() // 使value和其值保持一致
        })
        if (this.option.format) {
            this.editor.trigger('格式化json', 'editor.action.formatDocument')
        }
    },
    render () {
        return (<div ref="editorBox" style={{ height: `${this.height}px`, border: '1px solid #666' }}></div>)
    },
}


</script>

<style>
</style>
