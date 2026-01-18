const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
} = require('../middleware/validators');

router.post('/register', registerValidation, authController.register);

router.post('/login', loginValidation, authController.login);

router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
