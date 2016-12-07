const path = require('path');
const webpack = require('webpack');
const env = process.env.NODE_ENV || 'development';

const srcPath = path.resolve(__dirname + '/src');
const distPath = path.resolve(__dirname + '/dist');

module.exports = {
    context: srcPath,
    entry: '.',
    output: {
        libraryTarget: 'var',
        library: 'WskUtils',
        path: distPath,
        filename: 'wsk-utils.js'
    },
    watch: env === 'development',
    devtool: env === 'development' ? 'inline-source-map' : 'source-map',
    devServer: {
        contentBase: distPath
    },
    plugins: []
};

if (env === 'production') {
    module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
            drop_console: true,
            unsafe: true
        }
    }));
}
