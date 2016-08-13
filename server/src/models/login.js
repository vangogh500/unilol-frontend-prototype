// Login Schema

var mongoose = require('mongoose');

var LoginSchema = mongoose.Schema({
  email: String,
  password: String
});

module.exports = LoginSchema;
