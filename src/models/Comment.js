const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
      minlength: [1, 'Comment cannot be empty'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters'],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Comment must have an author'],
      index: true,
    },
    pageId: {
      type: String,
      required: [true, 'Comment must be associated with a page'],
      trim: true,
      index: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
      index: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    editedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ pageId: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1, createdAt: -1 });

commentSchema.virtual('likesCount').get(function () {
  return this.likes.length;
});

commentSchema.virtual('dislikesCount').get(function () {
  return this.dislikes.length;
});

commentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentComment',
});

commentSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

commentSchema.set('toObject', { virtuals: true });

commentSchema.methods.hasUserLiked = function (userId) {
  return this.likes.some((id) => id.toString() === userId.toString());
};

commentSchema.methods.hasUserDisliked = function (userId) {
  return this.dislikes.some((id) => id.toString() === userId.toString());
};

commentSchema.methods.isAuthor = function (userId) {
  return this.author.toString() === userId.toString();
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
