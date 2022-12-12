const User = require('../models/user-model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

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

async function signup(req, res) {
  const body = req.body; //body

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
    !validation.emailIsConfirm(body.email, body['confirm-email'])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        message: 'Invalid input - please check your data.',
        confirmEmail: body['confirm-email'],
        ...formData,
      },
      function () {
        res.redirect('/signup');
      }
    );
    return;
  }

  const user = new User(...Object.values(formData));

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
          res.redirect('/signup');
        }
      );
      return;
    }
    await user.signup();
  } catch (error) {
    return next(error);
  }

  res.redirect('/login');
}


function getLogin(req, res, next) {
	const sessionErrorData = sessionFlash.getSessionData(req, {
		email: '',
		password: '',
	  });

  res.render('customer/auth/login', {inputData: sessionErrorData});
}

async function login(req, res) {
  const formData = {
    email: req.body.email,
    password: req.body.password,
  };


  const user = new User(formData.email, formData.password);
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
      res.redirect('/login');
    });
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function () {
      res.redirect('/login');
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
  getSignup: getSignup,
  signup: signup,
  getLogin: getLogin,
  login: login,
  logout: logout,
};
