var bcrypt = require('bcryptjs');

exports.hash = function(password, cb) {
  bcrypt.hash(password, 10, function(err, hash) {
    if(err) {
      cb(err);
    }
    else {
      cb(err, hash);
    }
  });
}
