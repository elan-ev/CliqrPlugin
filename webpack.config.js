const webpack = require('webpack'),
      path = require('path'),
      ExtractTextPlugin = require('extract-text-webpack-plugin')

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

module.exports = {
    devtool: isProd ? 'source-map' : '#eval-source-map',
    context: path.join(__dirname, './assets/js'),
    entry: {
        studip: './studip-app.js',
        polls: './polls-app.js'
    },
    output: {
        path: path.join(__dirname, './static'),
        chunkFilename: '[name].chunk.js',
        filename: '[name].js',
        pathinfo: !isProd,
        publicPath: isProd ? undefined : 'https://localhost:8081/'
    },
    module: {
        rules: [
            {
                test: /assets\/scss\/.+\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: { url: false, importLoaders: 1 }
                        },
                        'postcss-loader'
                    ]
                })
            },
            {
                test: /assets\/js\/.+\.scss$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader', options: { importLoaders: 1 } },
                    'postcss-loader'
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
                loader: 'handlebars-loader',
                query: {
                    partialDirs: path.join(__dirname, './assets/hbs'),
                    helperDirs: [path.join(__dirname, './assets/js/helpers')]
                }
            }
        ]
    },
    resolve: {
        alias: {
            jquery: path.join(__dirname, './assets/js/jquery')
        },
        extensions: ['.js'],
        modules: [
            path.resolve('./assets/js'),
            'node_modules'
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new ExtractTextPlugin({
            filename: 'bundle.css',
            allChunks: false
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: !isProd,
            options: { }
        }),
        new webpack.optimize.UglifyJsPlugin({
            comments: !isProd,
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
        })
    ],
    devServer: {
        contentBase: './assets/js',
        https: true
        // hot: true
    }
};
