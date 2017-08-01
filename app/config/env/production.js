module.exports = {
    // db: 'mongodb://admin:funbegin@23.88.239.10:61511/funstart',
	db: 'mongodb://localhost:27017/timtro',
    sessionSecret: 'PDLDHAHQTVTD',
    key: {
        privateKey: 'CaS4mWZDOVghh122',
        tokenExpiry: 1 * 30 * 1000 * 60 //1 hour
    },
    token: {
        guest: 'CRv1o8FaogFa2SYU4F6Z9DzytqL1l4My'
    },
    facebook: {
        clientID: '170584416691811',
        clientSecret: '3a3cabfcbe1fcc2782b977aae1787d6c',
        callbackURL: '/oauth/facebook/callback',
        profileFields: ['id', 'displayName','email','gender']
    },
    email: {
        username: "funstart.net",
        password: "brandnew123",
        accountName: "Fun Start",
        verifyEmailUrl: "action/verify",
        resetPasswordUrl: "action/reset"
    },
    server: {
        host: 'http://www.funstart.net',
        port: 8236
    },
    app: {
        id: '170584416691811',
        name: 'Fun Start - Phá đảo thế giới ảo',
        description: 'Mini Webgame đối kháng số 1 Việt Nam!',
        url: 'https://www.funstart.net',
        image: 'https://www.funstart.net/sources/ads.jpg'
    }
}