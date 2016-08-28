
var mongoose = require('mongoose');

var SchoolSchema = mongoose.Schema({
  _id: {type: String, required: true, unique: true },
  bannerUrl: String,
  domain: {type: String, required: true, unique: true },
  roster: [{ type: String, unique: true, ref: 'User'}],
  admins: [{
    _summoner: {type: String, required: true, unique: true },
    role: { type: String, required: true }
  }]
});

module.exports = mongoose.model('School', SchoolSchema);
