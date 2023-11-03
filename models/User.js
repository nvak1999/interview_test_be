const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      default: "1999/05/11",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    address: {
      street: {
        type: String,
        default: "",
      },
      suite: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      zipcode: {
        type: String,
        default: "",
      },
      geo: {
        lat: {
          type: String,
          default: "",
        },
        lng: {
          type: String,
          default: "",
        },
      },
    },
    phone: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    company: {
      name: {
        type: String,
        default: "",
      },
      catchPhrase: {
        type: String,
        default: "",
      },
      bs: {
        type: String,
        default: "",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const user = this._doc;
  delete user.password;
  delete user.isDeleted;
  return user;
};

userSchema.methods.generateToken = async function () {
  const accessToken = await jwt.sign({ _id: this._id }, JWT_SECRET_KEY, {
    expiresIn: "1d",
  });
  return accessToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
