/**
 * Created by 15R on 2/5/2016.
 */
var nodemailer = require("nodemailer"),
    Config = require('./config');
var privateKey = Config.key.privateKey;
console.log(Config.server.host);
// create reusable transport method (opens pool of SMTP connections)

var smtpTransport = nodemailer.createTransport('smtps://'+Config.email.username+'%40gmail.com:'+Config.email.password+'@smtp.gmail.com');

exports.sentMailVerificationLink = function(user,token) {
    var from = Config.email.accountName+" Team<" + Config.email.username + ">";
    var mailbody = '<p>Cảm ơn bạn đã đăng ký tại '+Config.email.accountName+' </p><p>Mời bạn xác thực tài khoản đăng nhập vào hệ thống tại link sau:<br/><a href="'+Config.server.host+'/'+Config.email.verifyEmailUrl+'/'+token+'">Link Xác thực</a></p>';
    mail(from, user.email , "Xác thực tài khoản tại www.funstart.net", mailbody);
};
exports.sendMailResetPassword = function(user,token){
    var from = Config.email.accountName+" Team<" + Config.email.username + ">";
    var mailbody = '<p>Bạn nhận được mail này do bạn (hoặc một ai khác) yêu cầu được reset password của tài khoản.</p><p>Mời bạn click vào link sau để thực hiện:<br/><a href="'+Config.server.host+'/'+Config.email.resetPasswordUrl+'/'+token+'">Link Reset Password</a></p><p>Nếu bạn không yêu cầu điều này, hãy bỏ qua email và password vẫn được giữ nguyên như cũ.</p>';
    mail(from, user.email , "Thay đổi mật khẩu tại www.funstart.net", mailbody);
}
exports.sendMailDoneResetPassword = function(user){
    var from = Config.email.accountName+" Team<" + Config.email.username + ">";
    var mailbody = '<p>Đây là email xác nhận rằng tài khoản'+ user.username +' đã thay đổi mật khẩu thành công</p>';
    mail(from, user.email , "Hoàn thành thay đổi mật khẩu tại www.funstart.net", mailbody);
}

function mail(from, email, subject, mailbody){
    var mailOptions = {
        from: from, // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        //text: result.price, // plaintext body
        html: mailbody  // html body
    };

    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.error(error);
        }
        console.log(response);
        smtpTransport.close(); // shut down the connection pool, no more messages
    });
}