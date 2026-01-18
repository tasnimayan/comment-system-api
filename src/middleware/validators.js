const { body, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((err) => err.msg).join('. ');
    throw new ValidationError(messages);
  }
  next();
};

const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Name must be between 3 and 30 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validate,
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate,
];

module.exports = {
  registerValidation,
  loginValidation,
};
