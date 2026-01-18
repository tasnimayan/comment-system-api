const { body, param, query, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');
const { SORT_OPTIONS } = require('../utils/sortUtils');

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


const createCommentValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Comment must be between 1 and 2000 characters'),
  body('pageId')
    .trim()
    .notEmpty()
    .withMessage('Page ID is required'),
  body('parentCommentId')
    .optional({ nullable: true })
    .isMongoId()
    .withMessage('Invalid parent comment ID'),
  validate,
];

const updateCommentValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid comment ID'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Comment must be between 1 and 2000 characters'),
  validate,
];

const commentIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid comment ID'),
  validate,
];

const getCommentsValidation = [
  query('pageId')
    .trim()
    .notEmpty()
    .withMessage('Page ID is required'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort')
    .optional()
    .isIn(Object.values(SORT_OPTIONS))
    .withMessage(`Sort must be one of: ${Object.values(SORT_OPTIONS).join(', ')}`),
  query('parentCommentId')
    .optional({nullable: true})
    .isMongoId()
    .withMessage('Invalid parent comment ID'),
  validate,
];

module.exports = {
  registerValidation,
  loginValidation,
  createCommentValidation,
  updateCommentValidation,
  commentIdValidation,
  getCommentsValidation,
};
