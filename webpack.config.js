/// <reference path="./webpack.d.ts" />
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


/** @type {webpack.Configuration} */
const webpackConfig = {
  entry: './src/index.tsx',
  output: {
    filename: 'mplan.js',
    path: path.resolve(__dirname, './dist'),
  },
  module: {
    rules: [
      { test: /\.tsx?/, loader: 'awesome-typescript-loader' },
      {
        test: /\.css/, use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { minimize: true } },
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.css'],
  },
  devtool: 'source-map',
  plugins: [new HtmlWebpackPlugin()],
};

module.exports = webpackConfig;