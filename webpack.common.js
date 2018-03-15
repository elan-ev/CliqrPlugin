const webpack = require('webpack')
const path = require('path')

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
                test: /assets\/js\/.+\.scss$/,
                use: [
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
        })
    ],
    devServer: {
        contentBase: './assets/js',
        https: true
    }
}
