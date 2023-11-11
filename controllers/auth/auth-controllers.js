const User = require('../../models/user-model');
const authUtil = require('../../util/authentication');
const validation = require('../../util/validation');
const sessionFlash = require('../../util/session-flash');

function getSignup(req, res) {
  const sessionErrorData = sessionFlash.getSessionData(req, {
    email: '',
    confirmEmail: '',
    password: '',
    fullname: '',
    street: '',
    postal: '',
    city: '',
  });

  res.render('customer/auth/signup', { inputData: sessionErrorData });
}

async function signup(req, res, next) {
  const body = req.body;

  const formData = {
    email: body.email,
    password: body.password,
    fullname: body.fullname,
    street: body.street,
    postal: body.postal,
    city: body.city,
  };

  if (
    !validation.userDetailsIsValid(...Object.values(formData)) ||
    !validation.fieldIsConfirm(body.email, body['confirm-email'])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        message: 'Invalid input - please check your data.',
        confirmEmail: body['confirm-email'],
        ...formData,
      },
      function () {
        res.redirect('/auth/signup');
      }
    );
    return;
  }

  const user = new User(formData);

  try {
    const existsAlready = await user.existsAlready();
    if (existsAlready) {
      sessionFlash.flashDataToSession(
        req,
        {
          message: 'User exists already! Try logging in instead!',
          ...formData,
        },
        function () {
          res.redirect('/auth/signup');
        }
      );
      return;
    }
   const newUser = await user.signup();
    authUtil.createUserSession(req, {_id: newUser.insertedId}, function () {
      res.redirect('/');
    });
  } catch (error) {
    return next(error);
  }
}

function getLogin(req, res, next) {
  const sessionErrorData = sessionFlash.getSessionData(req, {
    email: '',
    password: '',
  });

  res.render('customer/auth/login', { inputData: sessionErrorData });
}

async function login(req, res) {
  const formData = {
    email: req.body.email,
    password: req.body.password,
  };

  const user = new User(formData);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {}

  const sessionErrorData = {
    message:
      'Invalid credentails - please double-check your email and password!',
    ...formData,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect('/auth/login');
    });
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect('/auth/login');
    });
    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect('/');
  });
}

function logout(req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect('/');
}

module.exports = {
  getSignup,
  signup,
  getLogin,
  login,
  logout,
};