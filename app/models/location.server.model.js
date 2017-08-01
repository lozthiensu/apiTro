/**
 * Created by baohq on 8/1/17.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
var LocationSchema = new Schema({
	_id: ObjectId,
	lat: Number,
	lng: Number,
	platform: [
        {
            userId:''
            , playerId:''
        }
    ]
});

mongoose.model('Location', LocationSchema);
