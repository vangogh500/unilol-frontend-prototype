
var mongoose = require('mongoose');

var SchoolSchema = mongoose.Schema({
  _id: {type: String, required: true, unique: true },
  logoUrl: String,
  name: String,
  domain: {type: String, required: true, unique: true },
  roster: [{ type: String, unique: true, ref: 'User'}],
  lastUpdate: Date,
  admins: [{
    _user: {type: String, unique: true, ref: 'User' },
    role: { type: String, required: true }
  }],
  events: [{type: String, unique: true, ref: 'Event'}]
});

module.exports = mongoose.model('School', SchoolSchema);
