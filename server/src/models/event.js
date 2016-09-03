var mongoose = require('mongoose');

var EventSchema = mongoose.Schema({
  name: String,
  description: String,
  text: String,
  official: {type: Boolean, default: false},
  startDate: Date,
  endDate: Date,
  posted: {type: Date, default: Date.now },
  location: String,
  url: String,
  participants: [{ type: String, unique: true, ref: 'User'}],
  createdBy: { type: String, ref: 'User'},
  organizers: [{ type: String, unique: true, ref: 'User'}]
});

module.exports = mongoose.model('Event', EventSchema);
