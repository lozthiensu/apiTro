/**
 * Created by baohq on 7/31/17.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var UserSchema = new Schema({
	_id: String,
	accessToken: String,
	created_time: Number,
	logged_time: Number,
	address: String,
	playerId: String,
	location: {
		lat: Number,
		lng: Number
	},
	price: Number,
	notification: Boolean
});

mongoose.model('User', UserSchema);
