module.exports = {
    root: true,
    extends: [
        '@smartx/eslint-config-tentative/vue',
    ],
    env: {
        node: true
    },
    parserOptions: { parser: 'babel-eslint' },
    globals: {

    },
    rules: {
        'no-return-assign': 'off', // 允许return中使用赋值操作
        'no-sequences': 'off', // Array.reduce中使用逗号运算符
        'no-console': [ 'error', { allow: [ 'warn', 'error' ] } ],
        'vue/array-bracket-spacing': [ 'error', 'always' ],
        'vue/arrow-spacing': 'error',
        'vue/block-spacing': 'error',
        'vue/camelcase': 'error',
        'vue/comma-dangle': [ 'error', 'always-multiline' ],
        'vue/eqeqeq': 'error',
        'vue/key-spacing': 'error',
        'vue/match-component-file-name': 'error',
        'vue/no-boolean-default': 'error',
        'vue/object-curly-spacing': [ 'error', 'always' ],
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': 'error',
        'vue/v-on-function-call': 'error',
    },
}
