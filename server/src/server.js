// Imports the express Node module.
var express = require('express');
// Creates an Express server.
var app = express();
// import all libraries
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport");
var transporter = nodemailer.createTransport(smtpTransport({
    host : "smtp.gmail.com",
    secureConnection : false,
    port: 587,
    auth : {
        user : "uniloltemp@gmail.com",
        pass : "umass2016"
    }
}));
// connect to db
mongoose.connect('mongodb://KaiMatsuda:namumyo@ds051595.mlab.com:51595/unilol');
// secret key for jwt
var secretKey = "riot-when-is-sandbox-mode-umass-amherst";
// insert middleware
app.use(bodyParser.json());
app.use(express.static('../client/build'));
// import all models
var User = require('./models/user.js');
var EmailVerificationToken = require('./models/EmailVerificationToken.js');

/**
 * Strips a password from a user object.
 */
function stripPassword(user) {
  if (user !== null) {
    delete user.password;
  }
  return user;
}

// TODO: transfer the email trimming logic and password hash to pre-hook
app.post('/user', function(req, res) {
  var user = req.body;
  user.email = user.email.trim().toLowerCase();
  bcrypt.hash(user.password, 10, function(err, hash) {
    if(err) {
      res.status(500).send(err);
    }
    else {
      user.password = hash;
      var newUser = new User(user);
      newUser.save(function(err) {
        if(err) {
          res.status(500).send(err);
        }
        else {
          var emailVerificationToken = new EmailVerificationToken({_userId: newUser._id});
          emailVerificationToken.createVerificationToken(function (err, token) {
            if (err) res.status(500).send({msg: err});
            var mailOptions = {
                from: "UniLoL <uniloltemp@gmail.com>", // sender address
                to: newUser.email, // list of receivers
                subject: "Verification Link", // Subject line
                text: "Test", // plaintext body
                html: "<b>Hello world ✔</b>" // html body
            };
            transporter.sendMail(mailOptions, function(error, response){
                if(error){
                    console.log(error);
                }else{
                    console.log("Message sent: " + response.message);
                }
                // if you don't want to use this transport object anymore, uncomment following line
                //smtpTransport.close(); // shut down the connection pool, no more messages
            });
            var message = {
                email: user.email,
                name: user.name,
                verifyURL: req.protocol + "://" + req.get('host') + "/verify/" + token};
            console.log(message);
            res.send();
          });
        }
      });
    }
  });
});

app.post('/login', function(req, res) {
  var loginData = req.body;
  var email = loginData.email.trim().toLowerCase();
  User.findOne({email: email}, 'email password', function(err, found) {
    if(err) {
      res.status(500).send({msg: err});
    }
    else if(found) {
      bcrypt.compare(loginData.password, found.password, function(err, success) {
        if(err) {
          res.status(500).send({msg: err});
        }
        else if(success) {
          jwt.sign({id: found._id}, secretKey, { expiresIn: '7 days'}, function(token) {
            found = found.toObject();
            stripPassword(found);
            res.send({
                user: found,
                token: token
            });
          });
        }
        else {
          res.status(401).end();
        }
      });
    }
    else {
      res.status(401).end();
    }
  });
});

// Starts the server on port 3000!
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
