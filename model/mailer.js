require('dotenv').config();
var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
   host: 'smtp.gmail.com',
   port: 465,
   secure: true, // Use `true` for port 465, `false` for all other ports
   auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
   },
});

function sendEmail(message) {
   transporter.sendMail(message);
}

module.exports = { sendEmail };