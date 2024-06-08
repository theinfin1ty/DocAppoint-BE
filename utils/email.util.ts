const sgMail = require('@sendgrid/mail');

const CONFIG = require('../config/config');

sgMail.setApiKey(CONFIG.SENDGRID_EMAIL_API_KEY);

const sendEmail = (details) => {
  const msg = {
    to: details.email,
    from: {
      name: 'DocAppoint',
      email: 'notification@myomasafecure.in',
    },
    subject: details.subject,
    text: `Please follow this link to reset your account password: ${details.link}`,
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

export default sendEmail;
