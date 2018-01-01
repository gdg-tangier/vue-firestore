var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path = require('path')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'vue-firestore.js',
        library: 'VueFirestore',
        libraryTarget: 'umd'
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            sourceMap: true
        })
    ],
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }]
    }
};