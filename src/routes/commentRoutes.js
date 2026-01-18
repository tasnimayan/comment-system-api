const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authenticate = require('../middleware/auth');
const {
  createCommentValidation,
  updateCommentValidation,
  commentIdValidation,
  getCommentsValidation,
} = require('../middleware/validators');

router.post(
  '/',
  authenticate,
  createCommentValidation,
  commentController.createComment
);

router.get(
  '/',
  // authenticate,
  getCommentsValidation,
  commentController.getComments
);

router.get(
  '/:id',
  authenticate,
  commentIdValidation,
  commentController.getCommentById
);

router.put(
  '/:id',
  authenticate,
  updateCommentValidation,
  commentController.updateComment
);

router.delete(
  '/:id',
  authenticate,
  commentIdValidation,
  commentController.deleteComment
);

router.post(
  '/:id/like',
  authenticate,
  commentIdValidation,
  commentController.likeComment
);

router.post(
  '/:id/dislike',
  authenticate,
  commentIdValidation,
  commentController.dislikeComment
);

router.get(
  '/:id/replies',
  authenticate,
  commentIdValidation,
  commentController.getReplies
);

module.exports = router;
