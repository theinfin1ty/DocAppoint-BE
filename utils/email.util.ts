const sgMail = require('@sendgrid/mail');

const CONFIG = require('../config/config');

sgMail.setApiKey(CONFIG.SENDGRID_EMAIL_API_KEY);

const sendEmail = (details) => {
  const msg = {
    to: 'gaming4247365@gmail.com',
    from: {
      name: 'DocAppoint',
      email: 'notification@myomasafecure.in',
    },
    subject: 'DocAppoint - OTP',
    text: `Your OTP is: ${details.otp}`,
  };
  sgMail
    .send(msg)
    .then((response) => {
      console.log(`Email delivered with status: ${response[0].statusCode}`);
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendEmail;
