const mongoose = require("../connection");

const UserSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true

    },

    last_name: {
      type: String,
      required: true

    },

    full_name: {
      type: String,
      required: true

    },

    email: {
      type: String,
      required: true

    },

    password: {
      type: String,
      required: true,
      select: false

    },

    passwordResetToken: {
        type: String,
        select: false

    },

    passwordResetExpires: {
        type: Date,
        select: false

    },

    active: {
        type: Boolean,
        required: true,
        default: true

    },

    createAt: {
        type: Date,
        required: false,
        default: Date.now

    },

    updatedAt: {
        type: Date,
        required: false,
        default: Date.now

    }, 

    lastLogin: {
      type: Date,
      required: false,
      default: Date.now

    }

});

const User = mongoose.model("User", UserSchema);

module.exports = User;
