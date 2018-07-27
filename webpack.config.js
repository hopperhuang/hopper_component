const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 暂时不使用此插件，否则会引起，每次重新编译时，dist文件夹中的html文件被删除，具体原因尚未明确
// const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './example/src/index.js',
  output: {
    path: path.resolve(__dirname, 'example/dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    // new CleanWebpackPlugin(['example/dist']),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './example/src/index.html',
    }),
  ],
};
