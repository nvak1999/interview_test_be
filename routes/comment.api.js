const express = require("express");
const router = express.Router();
const { param, body } = require("express-validator");
const commentController = require("../controllers/comment.controller");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

// Create a comment
router.post(
  "/",
  validators.validate([
    body("owner").notEmpty().withMessage("Owner is required"),
    body("post").notEmpty().withMessage("Post is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ]),
  commentController.createComment
);

// Get a comment by ID
router.get(
  "/:id",
  authentication.loginRequire,
  commentController.getCommentById
);

// Update a comment by ID
router.put(
  "/:id",
  authentication.loginRequire,
  commentController.updateComment
);

// Soft delete a comment
router.patch(
  "/:id",
  authentication.loginRequire,
  commentController.softDeleteComment
);

module.exports = router;
