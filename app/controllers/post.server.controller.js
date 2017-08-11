/**
 * Created by andh on 7/28/16.
 */
var Config = require('../config/config'),
	PAGE = 1,
	NUMOFPOST = 25,
	SORTBY = 'created_time',
	Post = require('mongoose').model('Post'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
var fs = require('fs');

exports.loadFeeds = function (req, res) {
	var page = parseInt(req.body.page) || PAGE;
	var sortBy = req.body.sortBy || SORTBY;
	console.log('Number of feeds: ', NUMOFPOST);
	console.log('Sort by: ', sortBy);
	console.log(req.body.groupId);
	var query = {};
	if (!!req.body.groupId) {
		query = {
			"group_id": req.body.groupId
		}
		console.log(query);
	}
	Post.find(query).skip(NUMOFPOST * (page - 1)).limit(NUMOFPOST).sort({
		"created_time": -1
	}).exec(function (err, result) {
		if (err) console.log('Error', err);
		res.json(result);
	});
};

exports.loadNewerFeeds = function (req, res) {
	var page = parseInt(req.body.page) || PAGE;
	var sortBy = req.body.sortBy || SORTBY;
	console.log('Number of feeds: ', NUMOFPOST);
	console.log('Sort by: ', sortBy);
	console.log(req.body.groupId);
	var query = {};
	if (!!req.body.groupId) {
		query = {
			group_id: req.body.groupId,
			created_time: req.body.created_time
		}
		console.log(query);
	}
	Post.find({
		created_time: {
			$gt: query.created_time
		}
	}).limit(50).sort({
		"created_time": -1
	}).exec(function (err, result) {
		if (err) console.log('Error', err);
		res.json(result);
	});
};
