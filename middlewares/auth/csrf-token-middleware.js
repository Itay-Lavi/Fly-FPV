const csrf = require('csurf');

function addCsrfToken(req, res, next) {
  try {
    res.locals.csrfToken = req.csrfToken();
  } catch (e) {}
  next();
}

function activeCSRFToken(req, res, next) {
  if (req.path === '/orders/webhook') {
    return next();
  }
  const csrfProtection = csrf();
  csrfProtection(req, res, next);
}

module.exports = {
  addCsrfToken,
  activeCSRFToken,
};
