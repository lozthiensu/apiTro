/**
 * Created by andh on 8/1/16.
 */
var passport = require('passport'),
    BearerStrategy = require('passport-http-bearer').Strategy,
    Config = require('../config'),
    Jwt = require('jsonwebtoken'),
    User = require('mongoose').model('User'),
    privateKey = Config.key.privateKey;
module.exports = function(){
    passport.use(new BearerStrategy({},
        function(token,done){
            if(token === Config.token.guest){
                return done(null,'guest');
            }
            Jwt.verify(token, privateKey, function(err, decoded) {
                console.log(err);
                if (decoded === undefined) {
                    return done(null,false);
                }
                User.findOne({email : decoded.email},function(err,user){

                    if(!user)
                        return done(null,false);
                    return done(null,user);
                })
            });



        }));
}