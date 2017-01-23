const webpack = require('webpack'),
      path = require('path'),
      postcss_autoprefixer = require('autoprefixer'),
      postcss_precss = require('precss'),
      postcss_atroot = require('postcss-atroot'),
      postcss_lost = require('lost'),
      postcss_calc = require('postcss-calc'),
      ExtractTextPlugin = require('extract-text-webpack-plugin')

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

module.exports = {
    devtool: isProd ? 'source-map' : '#eval-source-map',
    context: path.join(__dirname, './assets/js'),
    entry: {
        studip: './studip-app.js',
        polls: './polls-app.js',
        // vendor: [ 'backbone' ]
    },
    output: {
        path: path.join(__dirname, './static'),
        chunkFilename: '[name].chunk.js',
        filename: '[name].js',
        pathinfo: !isProd,
        publicPath: isProd ? undefined : 'http://localhost:8081/'
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]'
                }
            },
            {
                test:   /assets\/scss\/.+\.scss$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: 'css-loader?-url!postcss-loader'
                })
            },
            {
                test:   /assets\/js\/.+\.scss$/,
                loader: 'style-loader!css-loader!postcss-loader'
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: [
                    'babel-loader'
                ]
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
        new webpack.ProvidePlugin({
            Promise: 'imports-loader?this=>global!exports-loader?global.Promise!es6-promise'
        }),
        /*
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
            filename: 'vendor.bundle.js'
        }),
        */
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: !isProd,
            options: {
                postcss: [ postcss_atroot, postcss_precss, postcss_calc, postcss_autoprefixer, postcss_lost ]
            }
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
        contentBase: './assets/js'
        // hot: true
    }
};
