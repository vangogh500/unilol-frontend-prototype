var mongoose = require('mongoose');

var summonerVerificationTokenSchema = mongoose.Schema({
  _user: { type: String, ref: 'User', unique: true},
  name: {type: String, required: true, unique: true},
  summonerId: {type: String, required: true, unique: true },
  profileIconId: {type: Number},
  token: {type: String, required: true},
  level: {type: Number, required: true},
  createdAt: {type: Date, required: true, default: Date.now, expires: '4h'}
});

var uuid = require('node-uuid');
summonerVerificationTokenSchema.methods.createVerificationToken = function (done) {
    var verificationToken = this;
    var token = uuid.v4().slice(0,23);
    verificationToken.set('token', token);
    verificationToken.save( function (err) {
        if (err) {
          return done(err);
        }
        else {
          return done(null, token);
        }
    });
};

module.exports = mongoose.model('SummonerVerificationToken', summonerVerificationTokenSchema);
