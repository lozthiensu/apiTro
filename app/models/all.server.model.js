/**
 * Created by baohq on 7/31/17.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var AllSchema = new Schema({
	id: String,
    playerId: String
});

mongoose.model('All', AllSchema);
