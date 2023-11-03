const express = require("express");
const router = express.Router();
const { param, body } = require("express-validator");
const userController = require("../controllers/user.controller");
const validators = require("../middlewares/validators");
const authentication = require("../middlewares/authentication");

// Register a user
router.post(
  "/",
  validators.validate([
    body("name").notEmpty().withMessage("name is required"),
    body("username").notEmpty().withMessage("username is required"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ]),
  userController.register
);

// Get current user
router.get("/me", authentication.loginRequire, userController.getCurrentUser);

// Update user
router.put(
  "/:id",

  authentication.loginRequire,
  validators.validate([
    body("name").notEmpty().withMessage("Name is required"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email address"),
  ]),
  userController.updateUser
);

// Get a user by ID
router.get("/:id", authentication.loginRequire, userController.getUserById);

module.exports = router;
