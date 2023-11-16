const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: MAILER_USERNAME,
    pass: MAILER_PASSWORD,
  },
});

async function sendEmail(to, subject, html) {
  const mailOptions = {
    from: MAILER_USERNAME,
    to: to,
    subject: subject,
    html: html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}

module.exports = sendEmail;
