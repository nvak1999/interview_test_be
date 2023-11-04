const Comment = require("../models/Comment");
const User = require("../models/User");
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");

const commentController = {};

// Create a comment
commentController.createComment = catchAsync(async (req, res, next) => {
  const { owner, post, content } = req.body;

  const comment = await Comment.create({ owner, post, content });

  sendResponse(res, 201, true, comment, null, "Comment created successfully");
});

// Get a comment by ID
commentController.getCommentById = catchAsync(async (req, res, next) => {
  const commentId = req.params.id;

  const comment = await Comment.findOne({ _id: commentId, isDeleted: false });

  if (!comment) {
    throw new AppError(404, "Comment not found", "Get Comment error");
  }

  const user = await User.findById(comment.owner);
  const ownerName = user ? user.name : "Unknown";

  const commentWithOwnerName = {
    ...comment.toObject(),
    ownerName,
  };

  sendResponse(
    res,
    200,
    true,
    commentWithOwnerName,
    null,
    "Comment retrieved successfully"
  );
});

// Update a comment by ID
commentController.updateComment = catchAsync(async (req, res, next) => {
  const commentId = req.params.id;
  const { content } = req.body;

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, isDeleted: false },
    { content },
    { new: true }
  );

  if (!comment) {
    throw new AppError(404, "Comment not found", "Update Comment error");
  }

  sendResponse(res, 200, true, comment, null, "Comment updated successfully");
});

// Soft delete a comment
commentController.softDeleteComment = catchAsync(async (req, res, next) => {
  const commentId = req.params.id;

  // Find the comment by ID
  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new AppError(404, "Comment not found", "Delete Comment error");
  }

  // Check if the comment is already deleted
  if (comment.isDeleted) {
    throw new AppError(400, "Comment already deleted", "Delete Comment error");
  }

  // Mark the comment as deleted
  comment.isDeleted = true;
  await comment.save();

  sendResponse(res, 200, true, null, null, "Comment deleted successfully");
});

module.exports = commentController;
