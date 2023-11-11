const User = require('../../models/user-model');
const PasswordResetToken = require('../../models/token-model');
const sessionFlash = require('../../util/session-flash');
const validation = require('../../util/validation');
const sendEmail = require('../../util/mailer/nodemailer');
const mailerTemplates = require('../../util/mailer/templates');

async function getForgot(req, res, next) {
  PasswordResetToken.deleteExpiredTokens();
  const sessionErrorData = sessionFlash.getSessionData(req, {
    email: '',
  });

  res.render('customer/auth/forgot', { inputData: sessionErrorData });
}

async function forgot(req, res, next) {
  const body = req.body;

  const formData = {
    email: body.email,
  };

  if (!validation.emailIsValid(formData.email)) {
    sessionFlash.flashDataToSession(
      req,
      {
        message: 'Invalid email, please check you write correctly.',
        ...formData,
      },
      function () {
        res.redirect('/auth/forgot');
      }
    );
    return;
  }

  const user = await User.findByEmail(formData.email).catch((err) => {});
  if (!user) {
    sessionFlash.flashDataToSession(
      req,
      {
        message: 'Email not found, please check you write correctly.',
        ...formData,
      },
      function () {
        res.redirect('/auth/forgot');
      }
    );
    return;
  }

   PasswordResetToken.deleteExpiredTokens();
  const passwordResetTokenModel = new PasswordResetToken({ userId: user.id });
  const emailTemplate = mailerTemplates.resetPasswordTemplate(passwordResetTokenModel.token);

  try {
    await passwordResetTokenModel.saveToken();
    await sendEmail(formData.email, emailTemplate.subject, emailTemplate.html);
  } catch (err) {
    console.log(err);
  }

  sessionFlash.flashDataToSession(
    req,
    {
      message: 'Email sent, please check your inbox. tokens are valid for 24h',
      ...formData,
    },
    function () {
      res.redirect('/auth/forgot');
    },
    false
  );
  return;
}

async function getReset(req, res, next) {
  const token = req.params.token;
  const sessionErrorData = sessionFlash.getSessionData(req, {
    password: '',
    confirmPassword: '',
  });

  res.render('customer/auth/reset', {
    token: token,
    inputData: sessionErrorData,
  });
}

async function reset(req, res, next) {
  const token = req.params.token;
  const body = req.body;
  const formData = {
    password: body.password,
    confirmPassword: body.confirmPassword,
  };

  function customSessionFlash(message) {
    return sessionFlash.flashDataToSession(
      req,
      {
        message: message,
        ...formData,
      },
      function () {
        res.redirect(`/auth/reset/${token}`);
      }
    );
  }

  await PasswordResetToken.deleteExpiredTokens();

  
  let passwordResetToken;
  try {
    passwordResetToken = await PasswordResetToken.findToken(token);
  } catch (e) {
    return customSessionFlash(
      'Invalid token, please repeat the forgot password process.'
    );
  }

  if (!validation.passwordIsValid(formData.password)) {
    return customSessionFlash(
      'Password is not valid, please check your data and try again.'
    );
  } else if (
    !validation.fieldIsConfirm(formData.password, formData.confirmPassword)
  ) {
    return customSessionFlash('Password is not matching confirm password.');
  }

  try {
    const user = await User.findById(passwordResetToken.userId);
    await user.changePassword(formData.password);
    await passwordResetToken.deleteToken();
  } catch (e) {
    console.log(e);
    return customSessionFlash('Server error, please try again later.');
  }

  res.redirect('/auth/login');
}

module.exports = {
  getForgot,
  forgot,
  getReset,
  reset,
};
