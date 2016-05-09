var app = require('./app');
var config = require('config');
var mongoose = require('mongoose');

mongoose.connect(config.dbURI);

var server = app.listen(config.port);
