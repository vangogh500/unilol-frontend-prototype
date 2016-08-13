// User Schema

var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  fullName: {
    firstName: String,
    lastName: String
  },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true},
  emailVerified: {type: Boolean, required: true, default: false}
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
