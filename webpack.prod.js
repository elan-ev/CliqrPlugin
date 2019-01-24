const GitRevisionPlugin = require('git-revision-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const webpack = require('webpack')

let gitRevisionPlugin = new GitRevisionPlugin({
    lightweightTags: true
})

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    context: path.join(__dirname, './assets/js'),
    entry: {
        polls: './polls-app.js',
        'studip-cliqr': './studip-app.js'
    },
    output: {
        publicPath: undefined,
        path: path.join(__dirname, './static'),
        chunkFilename: '[name]-[chunkhash].chunk.js',
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                include: path.resolve(__dirname, 'assets/scss'),
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.scss$/,
                include: path.resolve(__dirname, 'assets/js'),
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.hbs/,
                include: path.resolve(__dirname, 'assets'),
                loader: 'handlebars-template-loader'
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        alias: {
            jquery: path.join(__dirname, './assets/js/jquery'),
            underscore: path.join(__dirname, './assets/js/underscore')
        },
        extensions: ['.js'],
        modules: [path.resolve('./assets/js'), 'node_modules']
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        gitRevisionPlugin,
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(gitRevisionPlugin.version()),
            COMMITHASH: JSON.stringify(gitRevisionPlugin.commithash())
        })
    ]
}
