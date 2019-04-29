/*
File: webpack.base.conf.js
Creation date: 2019-02-20
Author: Bogdan Stanciu
Type: JS
Author e-mail: bogdan.stanciu@studenti.unipd.it
Version: 0.0.1

Changelog:
0.0.1 || Bogdan Stanciu || 2019-02-20 || Configurazione base webpack
*/
const path = require('path');
const webpack = require('webpack');
const manifest = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const ExtractTextPluginBase = new ExtractTextPlugin('./css/panel.base.css');
const ExtractTextPluginDark = new ExtractTextPlugin('./css/panel.dark.css');
const ExtractTextPluginCustom = new ExtractTextPlugin('./css/style');



function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  target: 'node',
  context: resolve('src'),
  entry: './module.js',
  // watch: true,
  output: {
    filename: 'module.js',
    path: resolve('dist'),
    libraryTarget: "amd"
  },

  externals: [
    lodash = {
      commonjs: 'lodash',
      amd: 'lodash',
      root: '_' // indicates global variable
    },
    function(context, request, callback) {
      var prefix = 'grafana/';
      if(request.indexOf(prefix) === 0){
        return callback(null, request.substr(prefix.length));
      }
      callback();
    },
  ],

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CleanWebpackPlugin('dist', {allowExternal: true}),
    new CopyWebpackPlugin([
      { from: 'plugin.json' },
      { from: 'partials/*' },
      { from: 'css/*' }
    ]),
    ExtractTextPluginBase,
    ExtractTextPluginDark,
    ExtractTextPluginCustom,
  ],
  resolve: {
    extensions: ['.js', '.scss', '.css'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(external)/,
        use: {
          loader: 'babel-loader',
          query: {
            compact: false,
            presets: [
              require.resolve('babel-preset-env')
            ]
          }
        }
      },
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
      }
    ]
  },
  resolve: {
    alias: {
      'src': resolve('src')
    }
  }

}
