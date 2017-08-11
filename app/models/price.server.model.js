/**
 * Created by baohq on 7/31/17.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var PriceSchema = new Schema({
	_id: String,
	platform: [
        {
            userId:''
            , playerId:''
            , price: 0
        }
    ]
});

mongoose.model('Price', PriceSchema);
