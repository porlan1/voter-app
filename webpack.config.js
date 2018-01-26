var path = require('path');
var webpack = require('webpack');

 module.exports = {
    entry: './client/index.js',
    output: {
        path: path.resolve(__dirname, 'client'),
        filename: 'index.bundle.js'
    },
    module: {
        rules: [
            { test: /\.(js|jsx)$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ]}
        ]
    },
    stats: {
        colors: true
    },
    devtool: 'source-map'
 };