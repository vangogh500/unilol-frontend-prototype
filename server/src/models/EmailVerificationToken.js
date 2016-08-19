var mongoose = require('mongoose');

var emailVerificationTokenSchema = mongoose.Schema({
  email: {type: String, required: true, unique: [true, "email must be unique"]},
  password: {type: String, required: true },
  token: {type: String, required: true},
  createdAt: {type: Date, required: true, default: Date.now, expires: '4h'}
});

var uuid = require('node-uuid');
emailVerificationTokenSchema.methods.createVerificationToken = function (done) {
    var verificationToken = this;
    var token = uuid.v4();
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

module.exports = mongoose.model('EmailVerificationToken', emailVerificationTokenSchema);
