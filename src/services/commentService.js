const commentRepository = require('../repositories/commentRepository');
const {
  NotFoundError,
  AuthorizationError,
  ValidationError,
} = require('../utils/errors');
const { getSortCriteria } = require('../utils/sortUtils');
const {
  getPaginationParams,
  getPaginationMetadata,
} = require('../utils/paginationUtils');

class CommentService {
  async createComment(commentData, userId) {
    const { content, pageId, parentCommentId } = commentData;

    if (parentCommentId) {
      const parentComment = await commentRepository.findById(parentCommentId);
      if (!parentComment) {
        throw new NotFoundError('Parent comment not found');
      }
      if (parentComment.isDeleted) {
        throw new ValidationError('Cannot reply to a deleted comment');
      }
    }

    const comment = await commentRepository.createComment({
      content,
      pageId,
      author: userId,
      parentComment: parentCommentId || null,
    });

    const populatedComment = await commentRepository.findById(comment._id);
    return populatedComment;
  }

  async getComments(query) {
    const { pageId, sort = 'newest', parentCommentId } = query;
    const { page, limit, skip } = getPaginationParams(query);

    const sortCriteria = getSortCriteria(sort);

    const comments = await commentRepository.findByPageId(pageId, {
      skip,
      limit,
      sort: sortCriteria,
      parentCommentId: parentCommentId || null,
    });

    const totalCount = await commentRepository.countByPageId(
      pageId,
      parentCommentId || null
    );

    const pagination = getPaginationMetadata(page, limit, totalCount);

    return {
      comments,
      pagination,
    };
  }

  async getCommentById(commentId) {
    const comment = await commentRepository.findById(commentId);
    if (!comment || comment.isDeleted) {
      throw new NotFoundError('Comment not found');
    }
    return comment;
  }

  async updateComment(commentId, updateData, userId) {
    const comment = await commentRepository.findById(commentId);

    if (!comment || comment.isDeleted) {
      throw new NotFoundError('Comment not found');
    }

    if (comment.author._id.toString() !== userId.toString()) {
      throw new AuthorizationError('You can only edit your own comments');
    }

    const updatedComment = await commentRepository.updateComment(commentId, {
      content: updateData.content,
      isEdited: true,
      editedAt: new Date(),
    });

    return updatedComment;
  }

  async deleteComment(commentId, userId) {
    const comment = await commentRepository.findById(commentId);

    if (!comment || comment.isDeleted) {
      throw new NotFoundError('Comment not found');
    }

    if (comment.author._id.toString() !== userId.toString()) {
      throw new AuthorizationError('You can only delete your own comments');
    }

    await commentRepository.deleteComment(commentId);

    return { message: 'Comment deleted successfully' };
  }

  async likeComment(commentId, userId) {
    const comment = await commentRepository.findById(commentId);

    if (!comment || comment.isDeleted) {
      throw new NotFoundError('Comment not found');
    }

    const hasLiked = comment.hasUserLiked(userId);

    let updatedComment;
    if (hasLiked) {
      updatedComment = await commentRepository.removeLike(commentId, userId);
    } else {
      updatedComment = await commentRepository.addLike(commentId, userId);
    }

    return {
      comment: updatedComment,
      action: hasLiked ? 'unliked' : 'liked',
    };
  }

  async dislikeComment(commentId, userId) {
    const comment = await commentRepository.findById(commentId);

    if (!comment || comment.isDeleted) {
      throw new NotFoundError('Comment not found');
    }

    const hasDisliked = comment.hasUserDisliked(userId);

    let updatedComment;
    if (hasDisliked) {
      updatedComment = await commentRepository.removeDislike(commentId, userId);
    } else {
      updatedComment = await commentRepository.addDislike(commentId, userId);
    }

    return {
      comment: updatedComment,
      action: hasDisliked ? 'undisliked' : 'disliked',
    };
  }

  async getReplies(parentCommentId, query) {
    const parentComment = await commentRepository.findById(parentCommentId);
    if (!parentComment || parentComment.isDeleted) {
      throw new NotFoundError('Parent comment not found');
    }

    const { page, limit, skip } = getPaginationParams(query);
    const sortCriteria = getSortCriteria(query.sort || 'newest');

    const replies = await commentRepository.findReplies(parentCommentId, {
      skip,
      limit,
      sort: sortCriteria,
    });

    const totalCount = await commentRepository.countReplies(parentCommentId);
    const pagination = getPaginationMetadata(page, limit, totalCount);

    return {
      replies,
      pagination,
    };
  }
}

module.exports = new CommentService();
