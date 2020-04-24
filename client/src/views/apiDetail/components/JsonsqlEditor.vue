

<script>
import * as monaco from 'monaco-editor'


export default {
    props: {
        option: Object,
    },
    data () {
        return {
            editorHeight: 305,
            value: this.option.value,
        }
    },
    watch: {
        'option.value' (value) {
            if (value !== this.value) {
                this.editor.setValue(this.value = value)
            }
        },
    },
    created () {
        this.value = this.option.value
        this.onSave = function (value) {
            this.option.onSave && this.option.onSave(value)
        }
    },
    mounted () {
        const editor = this.editor = monaco.editor.create(this.$refs.editorBox, {
            value: this.value,
            theme: 'jsonsql',
            language: 'jsonsql',
            autoIndent: 'brackets',
            scrollBeyondLastLine: false,
        })
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => this.onSave(editor.getValue()))
        editor.onDidChangeModelContent(e => {
            this.value = this.option.value = editor.getValue() // 使value和其值保持一致
        })
    },
    render () {
        return (<div ref="editorBox" style={{ height: `${this.editorHeight}px` }}></div>)
    },
}

monaco.languages.register({ id: 'jsonsql' })
monaco.languages.setMonarchTokensProvider('jsonsql', {
    tokenizer: {
        root: [
            [ /@[a-zA-Z_$][\w$]*\b/, { token: 'data-field', _log: 'annotation token: $0' } ],
            [
                /(\/\/\/\s+)((?:[-+!*]\s+)?)([A-Za-z]+(?:,[A-Za-z]+)*\s+)(.+)/,
                [ 'document-token', 'document-change-flag', 'document-field-type', 'document-field-description' ],
            ],
        ],
    },
})
monaco.languages.setLanguageConfiguration('jsonsql', {
    brackets: [
        [ '{', '}' ],
        [ '[', ']' ],
        [ '(', ')' ],
    ],
    autoClosingPairs: [
        { open: '{', close: '}', notIn: [ 'string' ] },
        { open: '[', close: ']', notIn: [ 'string' ] },
        { open: '(', close: ')', notIn: [ 'string' ] },
        { open: '"', close: '"', notIn: [ 'string' ] },
        { open: '\'', close: '\'', notIn: [ 'string' ] },
    ],
})
monaco.editor.defineTheme('jsonsql', {
    base: 'vs-dark',
    inherit: true,
    rules: [
        { token: 'data-field', foreground: '569cd6' },
        { token: 'document-token', foreground: '808080' },
        { token: 'document-change-flag', foreground: '808080' },
        { token: 'document-field-type', foreground: '808080', fontStyle: 'normal' },
        { token: 'document-field-description', foreground: '808080' },
    ],
})
</script>

<style>
</style>
