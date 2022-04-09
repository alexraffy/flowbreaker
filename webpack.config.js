

const path = require('path');

module.exports = {
    mode: "production",
    entry: './build/main.js',
    output: {
        filename: 'flowbreaker.min.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'var',
        library: 'flowbreaker'
    },
    optimization: {
        minimize: false
    },

};