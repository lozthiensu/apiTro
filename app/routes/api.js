var post = require('../controllers/post.server.controller');
var user = require('../controllers/user.server.controller');

module.exports = function (router) {
	router.route('/listFeed').post(post.loadFeeds);
	router.route('/loadNewerFeeds').post(post.loadNewerFeeds);
	router.route('/login').post(user.login);
	router.route('/setPrice').post(user.setPrice);
	router.route('/setAddress').post(user.setAddress);
};
