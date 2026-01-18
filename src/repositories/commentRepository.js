const Comment = require('../models/Comment');

class CommentRepository {
  async createComment(commentData) {
    const comment = new Comment(commentData);
    return await comment.save();
  }

  async findById(commentId) {
    return await Comment.findById(commentId)
      .populate('author', 'name email')
      .populate('parentComment', 'content author');
  }

  async findByPageId(pageId, options = {}) {
    const {
      skip = 0,
      limit = 10,
      sort = { createdAt: -1 },
      parentCommentId = null,
    } = options;

    const query = {
      pageId,
      isDeleted: false,
      parentComment: parentCommentId,
    };

    const pipeline = [
      { $match: query },
    
      // Compute counts in MongoDB
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ['$likes', []] } },
          dislikesCount: { $size: { $ifNull: ['$dislikes', []] } },
        }
      },
    
      // Sort by the computed fields (or any other)
      { $sort: sort },
    
      { $skip: skip },
      { $limit: limit },
    
      // Populate author equivalent
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'author',
          pipeline: [{ $project: { name: 1, email: 1 } }],
        }
      },
      { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
    ];
    const comments = await Comment.aggregate(pipeline);

    return comments;
  }

  async countByPageId(pageId, parentCommentId = null) {
    return await Comment.countDocuments({
      pageId,
      isDeleted: false,
      parentComment: parentCommentId,
    });
  }

  async updateComment(commentId, updateData) {
    return await Comment.findByIdAndUpdate(
      commentId,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email');
  }

  async deleteComment(commentId) {
    return await Comment.findByIdAndUpdate(
      commentId,
      { isDeleted: true },
      { new: true }
    );
  }

  async addLike(commentId, userId) {
    return await Comment.findByIdAndUpdate(
      commentId,
      {
        $addToSet: { likes: userId },
        $pull: { dislikes: userId },
      },
      { new: true }
    ).populate('author', 'name email');
  }

  async removeLike(commentId, userId) {
    return await Comment.findByIdAndUpdate(
      commentId,
      { $pull: { likes: userId } },
      { new: true }
    ).populate('author', 'name email');
  }

  async addDislike(commentId, userId) {
    return await Comment.findByIdAndUpdate(
      commentId,
      {
        $addToSet: { dislikes: userId },
        $pull: { likes: userId },
      },
      { new: true }
    ).populate('author', 'name email');
  }

  async removeDislike(commentId, userId) {
    return await Comment.findByIdAndUpdate(
      commentId,
      { $pull: { dislikes: userId } },
      { new: true }
    ).populate('author', 'name email');
  }

  async findReplies(parentCommentId, options = {}) {
    const { skip = 0, limit = 10, sort = { createdAt: -1 } } = options;

    return await Comment.find({
      parentComment: parentCommentId,
      isDeleted: false,
    })
      .populate('author', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async countReplies(parentCommentId) {
    return await Comment.countDocuments({
      parentComment: parentCommentId,
      isDeleted: false,
    });
  }
}

module.exports = new CommentRepository();
