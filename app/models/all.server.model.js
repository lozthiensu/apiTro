/**
 * Created by baohq on 7/31/17.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
//	ObjectId = Schema.ObjectId;
var AllSchema = new Schema({
//    _id: ObjectId,
	id: String,
    playerId: String
});

mongoose.model('All', AllSchema);
