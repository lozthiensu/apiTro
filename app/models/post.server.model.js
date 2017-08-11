/**
 * Created by baohq on 7/24/17.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var PostSchema = new Schema({
	_id: String,
	group_id: String,
	created_time: Number,
	updated_time: Number,
	address: String,
	location: {},
	phone: String,
	type: Number,
	price: Number
});

mongoose.model('Post', PostSchema);
