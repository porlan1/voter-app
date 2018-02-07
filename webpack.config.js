var path = require('path');
var webpack = require('webpack');

 module.exports = {
    entry: {index: './client/index.js', user: './client/user_entry.js'},
    output: {
        path: path.resolve(__dirname, 'client'),
        filename: '[name].bundle.js'
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