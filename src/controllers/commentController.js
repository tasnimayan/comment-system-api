const commentService = require('../services/commentService');
const { asyncHandler } = require('../middleware/errorHandler');

const createComment = asyncHandler(async (req, res) => {
  const comment = await commentService.createComment(req.body, req.user.userId);

  res.status(201).json({
    success: true,
    message: 'Comment created successfully',
    data: comment,
  });
});

const getComments = asyncHandler(async (req, res) => {
  const result = await commentService.getComments(req.query);

  res.status(200).json({
    success: true,
    data: result.comments,
    pagination: result.pagination,
  });
});

const getCommentById = asyncHandler(async (req, res) => {
  const comment = await commentService.getCommentById(req.params.id);

  res.status(200).json({
    success: true,
    data: comment,
  });
});

const updateComment = asyncHandler(async (req, res) => {
  const comment = await commentService.updateComment(
    req.params.id,
    req.body,
    req.user.userId
  );

  res.status(200).json({
    success: true,
    message: 'Comment updated successfully',
    data: comment,
  });
});

const deleteComment = asyncHandler(async (req, res) => {
  const result = await commentService.deleteComment(
    req.params.id,
    req.user.userId
  );

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

const likeComment = asyncHandler(async (req, res) => {
  const result = await commentService.likeComment(
    req.params.id,
    req.user.userId
  );

  res.status(200).json({
    success: true,
    message: `Comment ${result.action} successfully`,
    data: result.comment,
  });
});

const dislikeComment = asyncHandler(async (req, res) => {
  const result = await commentService.dislikeComment(
    req.params.id,
    req.user.userId
  );

  res.status(200).json({
    success: true,
    message: `Comment ${result.action} successfully`,
    data: result.comment,
  });
});

const getReplies = asyncHandler(async (req, res) => {
  const result = await commentService.getReplies(req.params.id, req.query);

  res.status(200).json({
    success: true,
    data: result.replies,
    pagination: result.pagination,
  });
});

module.exports = {
  createComment,
  getComments,
  getCommentById,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
  getReplies,
};
