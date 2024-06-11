const nodemailer = require('nodemailer');
require('dotenv').config();
console.log(process);
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // QQ邮箱地址
    pass: process.env.EMAIL_PASS  // QQ邮箱的授权码
  }
});

const sendVerificationCode = (to, code) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: 'Your Verification Code',
    text: `Your verification code is: ${code}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
};

module.exports = sendVerificationCode;
