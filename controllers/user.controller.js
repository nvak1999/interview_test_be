const User = require(`../models/User.js`);
const { sendResponse, catchAsync, AppError } = require("../helpers/utils");
const bcrypt = require("bcryptjs");

const userController = {};

userController.register = catchAsync(async (req, res, next) => {
  // get data from request

  let { name, username, email, password } = req.body;

  // validation

  let user = await User.findOne({ username });

  if (user)
    throw new AppError(400, "User allready exists", "Registration Error");

  // process

  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  //Create user
  user = await User.create({ name, username, email, password });

  const accessToken = await user.generateToken();
  // response

  sendResponse(
    res,
    200,
    true,
    { user, accessToken },
    null,
    "Create user successful"
  );
});

userController.getCurrentUser = catchAsync(async (req, res, next) => {
  const currentUserId = req.userId;
  const user = await User.findById(currentUserId);

  if (!user)
    throw new AppError(400, "User not found", "Get Current user error");

  return sendResponse(
    res,
    200,
    true,
    user,
    null,
    "Get Current User successfully"
  );
});

// Update user by ID (excluding password)
userController.updateUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id;
  const { name, email, dob, address, phone, website, company } = req.body;

  // Check if the user exists
  const user = await User.findById(userId);

  if (!user) throw new AppError(404, "User not found", "Update User error");

  // Update user data (excluding password)
  if (name) user.name = name;
  if (email) user.email = email;
  if (dob) user.dob = dob;
  if (address) user.address = address;
  if (phone) user.phone = phone;
  if (website) user.website = website;
  if (company) user.company = company;

  // Save the updated user
  await user.save();

  sendResponse(res, 200, true, user, null, "User updated successfully");
});

userController.getUserById = catchAsync(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findOne({ _id: userId, isDeleted: false });

  if (!user) {
    throw new AppError(404, "User not found", "Profile Error");
  }

  sendResponse(res, 200, true, user, null, "Get User profile successfully");
});

module.exports = userController;
