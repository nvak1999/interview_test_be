const express = require("express");
const router = express.Router();
const { param, body } = require("express-validator");
const postController = require("../controllers/post.controller");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

// Create a post
router.post(
  "/",
  validators.validate([
    body("owner").notEmpty().withMessage("Owner is required"),
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
    body("tags").isArray().withMessage("Tags must be an array"),
  ]),
  postController.createPost
);

// Get all posts
router.get("/", authentication.loginRequire, postController.getAllPosts);

// Get a post by ID
router.get("/:id", authentication.loginRequire, postController.getPostById);

// Update
router.put("/:id", authentication.loginRequire, postController.updatePost);

// Delete
router.patch("/:id", authentication.loginRequire, postController.deletePost);

module.exports = router;
