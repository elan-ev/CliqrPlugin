import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rspack } from '@rspack/core';
import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
import * as sassEmbed from 'sass-embedded';

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';

console.error(process.env.NODE_ENV);

export default {
    experiments: {
        css: true,
    },
    devtool: isProduction ? false : 'source-map',
    context: path.join(__dirname, './src'),
    entry: {
        polls: './polls-app.js',
        'studip-cliqr': './studip-app.js',
    },
    output: {
        chunkFilename: '[name].chunk.js',
        publicPath: undefined,
        path: path.join(__dirname, './dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.(sass|scss)$/,
                use: [
                    {
                        loader: 'sass-loader',
                        options: {
                            api: 'modern-compiler',
                            implementation: sassEmbed,
                        },
                    },
                ],
                type: 'css',
            },
            {
                test: /\.(j|t)s$/,
                exclude: [/[\\/]node_modules[\\/]/],
                loader: 'builtin:swc-loader',
                options: {
                    jsc: {
                        parser: {
                            syntax: 'typescript',
                        },
                        externalHelpers: true,
                        transform: {
                            react: {
                                runtime: 'automatic',
                                development: !isProduction,
                                refresh: !isProduction,
                            },
                        },
                    },
                    env: {
                        targets: 'Chrome >= 48',
                    },
                },
            },
            {
                test: /\.hbs/,
                include: path.resolve(__dirname, 'src'),
                loader: 'handlebars-template-loader',
            },
        ],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
        extensions: ['.js'],
        modules: [path.resolve(__dirname, './src'), 'node_modules'],
    },
    plugins: [
        process.env.RSDOCTOR && new RsdoctorRspackPlugin({}),
        new rspack.CopyRspackPlugin({
            patterns: [
                { from: '../public', to: '../dist' },
                { from: '../node_modules/backbone/backbone-min.js', to: '../dist' },
            ],
        }),
    ],
    externals: {
        jquery: 'jQuery',
        underscore: '_',
        backbone: 'Backbone',
    },
};