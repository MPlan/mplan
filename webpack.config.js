/// <reference path="./webpack.d.ts" />
const path = require('path');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const webpack = require('webpack');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

/** @type {webpack.Configuration} */
const webpackConfig = {
  mode: process.env.NODE_ENV || 'production',
  entry: './src/client/index.tsx',
  output: {
    path: path.resolve(__dirname, './src/web-root'),
    filename: 'mplan.js',
  },
  module: {
    rules: [
      { test: /\.tsx?/, loader: 'awesome-typescript-loader' },
      {
        test: /\.css/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader', options: { minimize: true } }],
      },
    ],
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
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.TEST_USERNAME': JSON.stringify(process.env.TEST_USERNAME),
    }),
  ],
};

module.exports = webpackConfig;
