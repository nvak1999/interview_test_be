const Post = require("../models/Post.js");
const User = require("../models/User.js");
const Comment = require("../models/Comment.js");
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");

const postController = {};

// Create a new post
postController.createPost = catchAsync(async (req, res, next) => {
  const { owner, title, content, tags, img } = req.body;

  const post = await Post.create({ owner, title, content, tags, img });

  sendResponse(res, 201, true, post, null, "Post created successfully");
});

// Get a list of all posts
postController.getAllPosts = catchAsync(async (req, res, next) => {
  const { page, limit } = req.query;

  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 1000;

  const skip = (parsedPage - 1) * parsedLimit;

  const posts = await Post.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parsedLimit);

  const postsWithOwnerName = [];

  for (const post of posts) {
    const user = await User.findById(post.owner);
    const ownerName = user ? user.name : "Unknown";

    const comments = await Comment.find({ post: post._id, isDeleted: false });

    const commentsWithOwnerName = [];
    for (const comment of comments) {
      const commentOwner = await User.findById(comment.owner);
      const commentOwnerName = commentOwner ? commentOwner.name : "Unknown";
      commentsWithOwnerName.push({
        ...comment.toObject(),
        ownerName: commentOwnerName,
      });
    }

    postsWithOwnerName.push({
      ...post.toObject(),
      ownerName,
      comments: commentsWithOwnerName,
    });
  }

  sendResponse(
    res,
    200,
    true,
    postsWithOwnerName,
    null,
    "Get all posts retrieved successfully"
  );
});

// Get a specific post by ID
postController.getPostById = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  const post = await Post.findById({ _id: postId, isDeleted: false });

  if (!post) {
    throw new AppError(404, "Post not found", "Get Post error");
  }

  sendResponse(res, 200, true, post, null, "Post retrieved successfully");
});

// Update a specific post by ID (using PUT)
postController.updatePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;
  const { owner, title, content, tags } = req.body;

  const post = await Post.findByIdAndUpdate(
    postId,
    { owner, title, content, tags },
    { new: true }
  );

  if (!post) {
    throw new AppError(404, "Post not found", "Update Post error");
  }

  sendResponse(res, 200, true, post, null, "Post updated successfully");
});

// Delete a specific post by ID
postController.deletePost = catchAsync(async (req, res, next) => {
  const postId = req.params.id;

  // Find the post by ID
  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(404, "Post not found", "Delete Post error");
  }

  // Check if the post is already deleted
  if (post.isDeleted) {
    throw new AppError(400, "Post already deleted", "Delete Post error");
  }

  // Mark the post as deleted
  post.isDeleted = true;
  await post.save();

  sendResponse(res, 200, true, null, null, "Post deleted successfully");
});

module.exports = postController;
