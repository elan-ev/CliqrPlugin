const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        chunkFilename: '[name].chunk.js',
        publicPath: undefined
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                include: path.resolve(__dirname, 'assets/scss'),
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            }
        ]
    }
})
