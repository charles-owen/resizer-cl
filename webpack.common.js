const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/app.modules.js'
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Resizer',
            filename: 'index.html',
            template: 'src/html/index.html',
            inject: 'head'
        }),
        new HtmlWebpackPlugin({
            title: 'Dialog',
            filename: 'dialog.html',
            template: 'src/html/dialog.html',
            inject: 'head'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};
