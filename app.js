//set NODE_ENV
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./app/config/mongoose');
var db = mongoose(function () {
	var express = require('./app/config/express')();
	//    var passport = require('./app/config/passport')();
});
//module.exports = app;
