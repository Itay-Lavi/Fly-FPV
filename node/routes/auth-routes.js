const express = require('express');

const authController = require('../controllers/auth/auth-controllers');
const passwordController = require('../controllers/auth/password-controllers');

const router = express.Router();

router.get('/signup', authController.getSignup);

router.post('/signup', authController.signup)

router.get('/login', authController.getLogin);

router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.get('/forgot', passwordController.getForgot);

router.post('/forgot', passwordController.forgot);

router.get('/reset/:token', passwordController.getReset);

router.post('/reset/:token', passwordController.reset);

module.exports = router;