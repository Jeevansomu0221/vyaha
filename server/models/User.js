const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  name: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
