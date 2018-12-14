const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        chunkFilename: '[name].chunk.js',
        publicPath: undefined
    }
})
