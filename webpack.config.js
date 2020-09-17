const path = require('path')

const externalModules = [
    'aws-sdk'
]

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    target: 'node',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dists'),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    },
    externals: [
        ...externalModules
    ],
    node: {
        __dirname: true,
        __filename: true
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    }
}
