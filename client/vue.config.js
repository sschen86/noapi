// eslint-disable-next-line no-console
console.log('加载本地配置项...')

const path = require('path')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
// https://webpack.docschina.org/configuration/  webpack配置实例
// https://github.com/vuejs/vue-cli/blob/dev/docs/zh/guide/webpack.md
// https://github.com/neutrinojs/webpack-chain/blob/master/test/Rule.js  测试用例

module.exports = {

    // publicPath: '',
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        port: 80,
        proxy: {
            '/merchant-gw/': {
                target: 'https://test2sop.sharegoodsmall.com/', // 开发环境
                changeOrigin: true,
                /*
                pathRewrite: {
                    '^/merchant-console-gateway/': '/merchant-console-gateway/',
                }, */
            },
        },
        // after: require('./mock/index'),
    },
    configureWebpack: (function () {
        if (process.env.NODE_ENV === 'production') {
            return {
                plugins: [

                ],
            }
        } else {
            return {
                devtool: 'eval-source-map',
                plugins: [

                ],
            }
        }
    }()),
    chainWebpack: (config) => {
        // 修改svg加载配置
        const svgRule = config.module.rule('svg')
        svgRule.uses.clear()
        svgRule
            .include.add(path.join(__dirname, 'src/svgicon/svgs')).end()
            .include.add(path.join(__dirname, 'src/components')).end()
            .include.add(path.join(__dirname, 'src/views')).end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({ symbolId: 'icon-[name]' })

        // resolve override
        config.resolve.alias
            .set('@', path.resolve(__dirname, './src'))
            .set('@pkgs', path.resolve(__dirname, './src/packages'))
            .set('@comps', path.resolve(__dirname, './src/components'))
            .set('@styles', path.resolve(__dirname, './src/styles'))
            .set('@views', path.resolve(__dirname, './src/views'))

        // monaco-editor
        config.plugin('monaco-editor').use(MonacoWebpackPlugin, [
            {
                // Languages are loaded on demand at runtime
                languages: [ 'json', 'javascript', 'html', 'xml' ],
            },
        ])
    },
}
