const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    devtool: 'inline-source-map',
    output: {
        publicPath: 'https://localhost:8081/'
    },
    optimization: {
    },
    devServer: {
        contentBase: './assets/js',
        compress: true,
        port: 8081,
        historyApiFallback: true,
        https: true
    }
})
