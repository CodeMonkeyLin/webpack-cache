const path = require("path")
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        index: "./src/index.js",
        main: "./src/main.js",
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].[contenthash:8].bundle.js'
    },
    plugins: [new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html'
    })],
    mode: 'production'
}