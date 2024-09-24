// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/index.jsx',
    background: './src/background.jsx',
    content: './src/content.jsx',
  },
  output: {
    filename: '[name].bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
  },
  mode: 'development', // Change to 'production' for production builds
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devtool: 'inline-source-map', // Useful for debugging
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader', // Injects styles into DOM
          'css-loader',   // Turns CSS into CommonJS
          'sass-loader',  // Compiles Sass to CSS
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource', // Handles image imports
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // Cleans the dist folder before each build
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'popup.html',
      chunks: ['popup'],
      favicon: './public/icons/favicon.ico',
    }),
  ],
};