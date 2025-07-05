const { Resend } = require('resend');

const CONFIG = require('../config/config');

const sendEmail = async (details) => {
  const resend = new Resend(process.env.RESEND_EMAIL_API_KEY);
  const msg = {
    to: details.to,
    from: 'Myomasafecure <notifications@myomasafecure.in>',
    subject: details.subject,
    html: `${details.text}`,
  };

  const res = await resend.emails.send(msg);
  console.log(res);
};

export default sendEmail;
