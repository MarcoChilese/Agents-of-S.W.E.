/*
File: webpack.conf.js
Creation date: 2019-02-20
Author: Bogdan Stanciu
Type: JS
Author e-mail: bogdan.stanciu@studenti.unipd.it
Version: 0.0.1

Changelog:
0.0.1 || Bogdan Stanciu || 2019-02-20 || Configurazione base webpack (generata)
*/
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const ExtractTextPluginBase = new ExtractTextPlugin('./css/panel.base.css');
const ExtractTextPluginLight = new ExtractTextPlugin('./css/panel.light.css');
const ExtractTextPluginDark = ExtractTextPlugin('./css/panel.dark.css');

function resolve(dir) {
	return path.join(__dirname, '..', dir)
}

module.exports = {
	target: 'node',
	context: resolve('src'),
	entry: './module.js',
	output: {
		filename: "module.js",
		path: resolve('dist'),
		libraryTarget: "amd"
	},
	externals: [
		'jquery', 'loadsh', 'moment',
		function (context, request, callback) {
			var prefix = 'grafana/';
			if (request.indexOf(prefix) === 0){
				return callback(null, request.substr(prefix.length));
			}
			callback();
		}
	],
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new CopyWebpackPlugin([
			{ from: 'plugin.json' },
			{ from: 'partials/*' }
		]),
		ExtractTextPluginBase,
		ExtractTextPluginLight,
		ExtractTextPluginDark,
	],
	resolve: {
		alias: {
			'src': resolve('src')
		}
	}
}




