// var socket = require('socket.io');
// var server = require('letsencrypt-express').create({
//     server: 'staging'
//     , email: 'secret.andoan@gmail.com'
//     , agreeTos: true
//     , approveDomains: [ 'www.funstart.net' ]
//     , app: require('express')()
// }).listen(8088,443);
//
// var io = socket.listen(server);

var fs = require( 'fs' );
var appIO = require('express')();
var https        = require('https');
var server = https.createServer({
    key: fs.readFileSync(__dirname + '/../../../../../../etc/letsencrypt/live/www.funstart.net/privkey.pem'),
    cert: fs.readFileSync(__dirname + '/../../../../../../etc/letsencrypt/live/www.funstart.net/fullchain.pem'),
    requestCert: false,
    rejectUnauthorized: false
},appIO);
server.listen(8088);
var io = require('socket.io').listen(server);

// var io = require('socket.io')(8088);
// console.log('io',io);
exports.getSocket = function(){
    return io;
};