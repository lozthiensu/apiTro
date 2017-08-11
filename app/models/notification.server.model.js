/**
 * Created by baohq on 7/31/17.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
var NotificationSchema = new Schema({
	_id: ObjectId,
	userId: String,
	postId: String,
	content: String,
	read: Number,
    created_time: Number
});
mongoose.model('Notification', NotificationSchema);
