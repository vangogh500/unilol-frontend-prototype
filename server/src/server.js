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
    secureConnection : true,
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

/*
 * Registering logic:
 * 1. create email verification token
 * 2. create user after verifying token
 */

/**
 * Create verification token
 * verb: POST
 * path: '/emailVerificationToken'
 * @params: email, password
 * logic:
 *  1. check that user with @email (trimmed and lower cased) does not exists
 *  2. hash and salt @password
 *  3. create email verification token (store @email and hashed/salted @password)
 *  4. email verification link to @email
 * response codes:
 *  200: success
 *  401: user with email already exists
 *  500: database error, bcrypt error, nodemailer error
 */
app.post('/emailVerificationToken', function(req, res) {
  var user = req.body;
  user.email = user.email.trim().toLowerCase();
  User.findOne({email: req.body.email}, function(error, found) {
    if(error) {
      res.status(500).send(error);
    }
    else if(found) {
        res.status(401).send("a user with the following email already exists")
    }
    else {
      bcrypt.hash(user.password, 10, function(e, hash) {
        if(e) {
          res.status(500).send(e);
        }
        else {
          var emailVerificationToken = new EmailVerificationToken({email: user.email, password: hash});
          emailVerificationToken.createVerificationToken(function (err, token) {
            if (err) { res.status(500).send({msg: err.message}); }
            else {
              var link = req.protocol + "://" + req.get('host') + "/#/verifyEmail/" + token;
              var mailOptions = {
                  from: "UniLoL <uniloltemp@gmail.com>", // sender address
                  to: user.email, // list of receivers
                  subject: "Verification Link", // Subject line
                  text: "Test", // plaintext body
                  html: '<div style="background: #212121; color: #FFF; padding: 5px;"><h3>UniLol</h3></div><p>Thank you for registering with us. Follow the link below to get one step closer to participating in your campus community:</p><a href=\"' + link + '\" >' + link + '</a>' // html body
              };
              transporter.sendMail(mailOptions, function(error){
                  if(error){
                      res.status(500).send(error);
                  }else{
                      res.send();
                  }
              });
            }
          });
        }
      });
    }
  })
});

/**
 * Resend verification token
 * verb: GET
 * path: '/emailVerificationToken'
 * @params: email
 * logic:
 *  1. find email verification token with @email
 *  2. email verification token to @email
 * response codes:
 *  200: success
 *  404: could not find
 *  500: database error, nodemailer error
 */
 app.get('/emailVerificationToken/:email', function(req,res) {
   console.log(req.params.email);
   EmailVerificationToken.findOne({email: req.params.email}, function(err, found) {
     if(err) {
       res.status(500).send(err);
     }
     else if(found){
       var link = req.protocol + "://" + req.get('host') + "/#/verifyEmail/" + found.token;
       var mailOptions = {
           from: "UniLoL <uniloltemp@gmail.com>", // sender address
           to: found.email, // list of receivers
           subject: "Verification Link (Resend)", // Subject line
           text: "Test", // plaintext body
           html: '<div style="background: #212121; color: #FFF; padding: 5px;"><h3>UniLol</h3></div><p>Thank you for registering with us. Follow the link below to get one step closer to participating in your campus community:</p><a href=\"' + link + '\" >' + link + '</a>' // html body
       };
       transporter.sendMail(mailOptions, function(error){
           if(error){
               res.status(500).send(error);
           }else{
               res.send();
           }
       });
     }
     else {
       res.status(404).send("could not find a registration key for the following email. please try registering with the same email again");
     }
  });
 });



/**
 * Verify token and create user
 * verb: POST
 * path: '/user'
 * @params: token
 * logic:
 *  1. check that an email verification token exists with @token
 *  2. create user using the password and email from token
 *  3. delete verification token
 * response codes:
 *  200: success
 *  401: invalid token
 *  500: database error
 */
app.post('/user', function(req, res) {
  EmailVerificationToken.findOne({token: req.body.token}, function(err, token) {
    if(err) {
      res.status(500).send(err);
    }
    else if(token) {
      var newUser = new User({email: token.email, password: token.password});
      newUser.save(function(err) {
        if(err) {
          res.status(500).send(err);
        }
        else {
          token.remove();
          res.send();
        }
      });
    }
    else {
      res.status(401).send("invalid verification link");
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
