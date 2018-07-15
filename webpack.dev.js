const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        publicPath: 'https://localhost:8081/'
    },
    devServer: {
        contentBase: './assets/js',
        compress: true,
        port: 8081,
        historyApiFallback: true,
        https: true
    }
})
