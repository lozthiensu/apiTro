var passport = require('passport'),
    mongoose = require('mongoose');
var User = mongoose.model('User');
module.exports = function() {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findOne({
            _id: id
        }, '-password -salt', function(err, user) {
            if(user.status != 1){
                user.status = 1;
                user.active = Date.now();
                user.save();
            };
            user._doc.created = parseInt(user._doc.created.getTime());
            user._doc.active = parseInt(user._doc.active.getTime());
            var virtual = user.toObject({ virtuals: true });
            user._doc.fire = virtual.fire;
            user._doc.level = virtual.level;
            user._doc.next = virtual.next;
            done(err, user);
        });
    });
    require('./strategies/bearer')();
    require('./strategies/facebook')();
    require('./strategies/local')();
};