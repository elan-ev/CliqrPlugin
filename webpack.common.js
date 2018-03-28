const webpack = require('webpack')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
    context: path.join(__dirname, './assets/js'),
    entry: {
        studip: './studip-app.js',
        polls: './polls-app.js'
    },
    output: {
        path: path.join(__dirname, './static'),
        chunkFilename: '[name].chunk.js',
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /assets\/scss\/.+\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    //{ loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            importLoaders: 1
                        }
                    },
                    { loader: 'postcss-loader' }
                ]
            },
            {
                test: /assets\/js\/.+\.scss$/,
                use: [
                    // MiniCssExtractPlugin.loader,
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,
                            importLoaders: 1
                        }
                    },
                    { loader: 'postcss-loader' }
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.hbs$/,
                use: [ { loader: 'handlebars-loader' } ]
            }
        ]
    },
    resolve: {
        alias: {
            jquery: path.join(__dirname, './assets/js/jquery')
        },
        extensions: [ '.js' ],
        modules: [ path.resolve('./assets/js'), 'node_modules' ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            options: {
                handlebarsLoader: {
                    partialDirs: path.join(__dirname, './assets/hbs'),
                    helperDirs: [ path.join(__dirname, './assets/js/helpers') ]
                }
            }
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new OptimizeCSSAssetsPlugin()
    ]
}
