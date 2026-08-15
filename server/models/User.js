const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  googleId: {
    type: String,
    default: '',
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
