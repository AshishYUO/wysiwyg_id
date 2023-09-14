const path = require('path');

module.exports = {
    entry: path.resolve(dirname, './src/index.ts'),
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-typescript'
                        ]
                    },
                }
            },
        ]
    },
    resolve: {
        extensions: ['*', '.ts']
    },
    output: {
        path: path.resolve(dirname, './dist'),
        filename: 'main.js',
    },
    devServer: {
        contentBase: path.resolve(dirname, './dist'),
    },
    watch: true
};
