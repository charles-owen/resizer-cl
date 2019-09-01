const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');


module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true  // Must be set to true if using source-maps in production
            })
        ]
    },
    output: {
        filename: 'resizer.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'Resizer',
        libraryTarget: 'umd',
        libraryExport: "default"
    },
});
