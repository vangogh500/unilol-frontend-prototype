// User Schema

var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  profile: {
    firstName: String,
    lastName: String,
    major: String,
    graduationYear: Number
  },
  _summoner: { type: Number, unique: true, ref: 'Summoner'},
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true}
});

module.exports = mongoose.model('User', UserSchema);
