/**
 * Created by andh on 7/19/16.
 */
var config = require('./config.js'),
	mongoose = require('mongoose');

module.exports = function (callback) {
	console.log('BAO', config.db);
	var db = mongoose.connect(config.db);
	//mongoose.Promise = global.Promise;
	var dbc = mongoose.connection;
	dbc.on('error', console.error.bind(console, 'connection error:'));
	dbc.once('open', function () {
		console.log("DB connect successfully!");
		callback();
	});
	require('../models/post.server.model');
	require('../models/user.server.model');
	require('../models/price.server.model');
	require('../models/location.server.model');
	require('../models/all.server.model');
	require('../models/priceAndLocation.server.model');
	require('../models/notification.server.model');
	return db;
};
