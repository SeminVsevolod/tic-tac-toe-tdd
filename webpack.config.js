const webpack = require('webpack');
const path = require('path');

module.exports = [{
    name: 'client',
    mode: 'production',
    context: path.resolve(__dirname),
    entry: {
        javascript: ['babel-polyfill', './src/index.js']
    },
    output: {
        filename: './js/bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
}];