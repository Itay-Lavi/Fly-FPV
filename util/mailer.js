const nodemailer = require('nodemailer');

function resetPasswordTemplate(token) {
  const html = `
  <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Arial', sans-serif;
 
        }

        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }

        .logo {
            color: #FFA500;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .reset-link {
            display: inline-block;
            padding: 10px 20px;
            background-color: #FFA500;
            color: #000;
            text-decoration: none;
            font-weight: bold;
            border-radius: 5px;
        }

        .reset-link:hover {
            background-color: #FFD700;
        }
    </style>
</head>
<body>
<div class="container">
<div class="logo">FlyFPV</div>
<h2>Password Reset</h2>
<p>You have requested a password reset. Click the link below to reset your password:</p>
<a href="http://${HOSTNAME}/auth/reset/${token}" target="_blank" class="reset-link">Reset Password</a>
<p>If you did not request a password reset, please ignore this email.</p>
</div>
</body>
</html>`;

  return { subject: 'Reset Password', html: html };
}

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

module.exports = {
  sendEmail,
  resetPasswordTemplate,
};
