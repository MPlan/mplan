const path = require('path');
const webpack = require('webpack');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

/** @type {webpack.Configuration} */
const webpackConfig = {
  mode: process.env.NODE_ENV || 'production',
  entry: ['babel-polyfill', './src/client/index.tsx'],
  output: {
    path: path.resolve(__dirname, './src/web-root'),
    filename: 'mplan.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: [require('babel-plugin-styled-components')],
            },
          },
          { loader: 'awesome-typescript-loader' },
        ],
      },
      {
        test: /\.css/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader', options: { minimize: true } }],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.css'],
    alias: {
      recordize: path.resolve(__dirname, './src/recordize'),
      styles: path.resolve(__dirname, './src/client/styles'),
      models: path.resolve(__dirname, './src/models'),
      utilities: path.resolve(__dirname, './src/utilities'),
      components: path.resolve(__dirname, './src/client/components'),
      routes: path.resolve(__dirname, './src/client/routes'),
      client: path.resolve(__dirname, './src/client'),
      server: path.resolve(__dirname, './src/server'),
      sync: path.resolve(__dirname, './src/sync'),
    },
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
      'process.env.AUTHORIZATION_URI': JSON.stringify(process.env.AUTHORIZATION_URI),
    }),
  ],
};

module.exports = webpackConfig;
