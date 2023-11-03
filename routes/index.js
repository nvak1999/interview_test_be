var express = require("express");
var router = express.Router();

const authApi = require("./auth.api");
const userApi = require("./user.api");
const postApi = require("./post.api");
const commentApi = require("./comment.api.js");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("hello");
});

router.use("/auth", authApi);
router.use("/users", userApi);
router.use("/comments", commentApi);
router.use("/posts", postApi);
module.exports = router;
