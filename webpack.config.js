/// <reference path="./webpack.d.ts" />
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');


/** @type {webpack.Configuration} */
const webpackConfig = {
  entry: './src/client/index.tsx',
  output: {
    path: path.resolve(__dirname, './src/web-root'),
    filename: 'mplan.js',
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
  devServer: {
    contentBase: path.resolve(__dirname, './src/web-root'),
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:8090',
    }
  }
};

module.exports = webpackConfig;