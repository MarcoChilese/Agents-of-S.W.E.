/*
File: webpack.dev.conf.js
Creation date: 2019-02-20
Author: Bogdan Stanciu
Type: JS
Author e-mail: bogdan.stanciu@studenti.unipd.it
Version: 0.0.1

Changelog:
0.0.1 || Bogdan Stanciu || 2019-02-20 || Configurazione development webpack
*/
const baseWebpackConfig = require('./webpack.base.conf');

var conf = baseWebpackConfig;
conf.watch = true;
conf.devtool = "source-map";

module.exports = conf;
