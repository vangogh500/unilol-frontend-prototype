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

var riot = require('./lib/riot.js');

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
var SummonerVerificationToken = require('./models/SummonerVerificationToken.js');
var Summoner = require('./models/summoner.js')

var RESPONSE_MSGS = require('./serverResponseMsgs.js')

/*
 * Registering logic:
 * 1. create email verification token
 * 2. create user after verifying token
 */

/**
 * Create verification token
 * verb: POST
 * path: '/emailVerificationToken'
 * @param: email, password
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
  const ERROR_401 = "A user with the following email already exists."
  const SUCCESS_200 = "Success! Please check your email for a verification link."
  var user = req.body;
  user.email = user.email.trim().toLowerCase();
  User.findOne({email: req.body.email}, function(error, found) {
    if(error) {
      res.status(500).send({msg: RESPONSE_MSGS.RESPONSE_MSGS.ERROR_500});
    }
    else if(found) {
        res.status(401).send({msg: ERROR_401})
    }
    else {
      bcrypt.hash(user.password, 10, function(e, hash) {
        if(e) {
          res.status(500).send({msg: RESPONSE_MSGS.ERROR_500});
        }
        else {
          var emailVerificationToken = new EmailVerificationToken({email: user.email, password: hash});
          emailVerificationToken.createVerificationToken(function (err, token) {
            if (err) { res.status(500).send({msg: RESPONSE_MSGS.ERROR_500}); }
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
                      res.status(500).send({msg: RESPONSE_MSGS.ERROR_500});
                  } else{
                      res.send({msg: SUCCESS_200});
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
 * @param: email
 * logic:
 *  1. find email verification token with @email
 *  2. email verification token to @email
 * response codes:
 *  200: success
 *  404: could not find
 *  500: database error, nodemailer error
 */
 app.get('/emailVerificationToken/:email', function(req,res) {
   const SUCCESS_200 = "Success! Verification link has been delivered.";
   const ERROR_404 = "Could not find a registration for the following email. Please try registering with your email again."
   EmailVerificationToken.findOne({email: req.params.email}, function(err, found) {
     if(err) {
       res.status(500).send({msg: RESPONSE_MSGS.ERROR_500});
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
               res.status(500).send({msg: RESPONSE_MSGS.ERROR_500});
           }else{
               res.send({msg: SUCCESS_200});
           }
       });
     }
     else {
       res.status(404).send({msg: ERROR_404});
     }
  });
 });

/**
 * Verify token and create user
 * verb: POST
 * path: '/user'
 * @param: token
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
  const SUCCESS_200 = "Success! You may now login with your email and password.";
  const ERROR_404 = "Uh oh. Invalid verification link.";
  EmailVerificationToken.findOne({token: req.body.token}, function(err, token) {
    if(err) {
      res.status(500).send({msg: RESPONSE_MSGS.ERROR_500});
    }
    else if(token) {
      var newUser = new User({email: token.email, password: token.password});
      newUser.save(function(err) {
        if(err) {
          res.status(500).send({msg: RESPONSE_MSGS.ERROR_500});
        }
        else {
          token.remove();
          res.send({msg: SUCCESS_200});
        }
      });
    }
    else {
      res.status(401).send({msg: ERROR_404});
    }
  });
});

/**
 * Login
 * verb: POST
 * path: '/login'
 * @param: email, password
 * logic:
 *  1. find user with @email
 *  2. compare password field with @password using Bcrypt
 *  3. return json web token and user object
 * response codes:
 *  200: success
 *  401: password or email is incorrect
 *  500: database error, bcrypt error
 * @return: token, user
 */
app.post('/login', function(req, res) {
  const ERROR_401 = "Invalid email or password."
  var loginData = req.body;
  if(!loginData.email || !loginData.password ) {
    res.status(400).send({msg: "bad request"})
    return;
  }
  var email = loginData.email.trim().toLowerCase();
  User.findOne({email: email}, function(err, found) {
    if(err) {
      res.status(500).send({msg: RESPONSE_MSGS.ERROR_500});
      return;
    }
    else if(found) {
      bcrypt.compare(loginData.password, found.password, function(err, success) {
        if(err) {
          res.status(500).send({msg: RESPONSE_MSGS.ERROR_500});
        }
        else if(success) {
          jwt.sign({id: found._id}, secretKey, { expiresIn: '7 days'}, function(token) {
            console.log("test");
            found = found.toObject();
            delete found.password;
            res.send({
              user: found,
              token: token,
              msg: "Success! Please continue to your profile page"
            });
          });
        }
        else {
          res.status(401).send({ msg: ERROR_401 });
        }
      });
    }
    else {
      res.status(401).send({ msg: ERROR_401 });
    }
  });
});

app.put('/user', function(req, res) {
  var authorizationLine = req.headers.authorization;
  var token = authorizationLine.slice(7);
  jwt.verify(token, secretKey, function(err, data) {
    if(err) {
      console.log(err);
      res.status(401).send();
    }
    else {
      var user = req.body;
      User.findOne({ _id: data.id, email: user.email }, function(err, found) {
        if(err) {
          res.status(500).send();
        }
        else if(found) {
          found.profile = user.profile
          found.save(function(err) {
            if(err) {
              res.status(500).send();
            }
            else {
              found = found.toObject();
              delete found.password;
              res.send(found);
            }
          })
        }
        else {
          res.status(401).send();
        }
      });
    }
  });
});

app.post('/summonerVerificationToken', function(req, res) {
  var authorizationLine = req.headers.authorization;
  var token = authorizationLine.slice(7);
  jwt.verify(token, secretKey, function(err, data) {
    if(err) {
      console.log(err);
      res.status(401).send();
    }
    else {
      var body = req.body;
      SummonerVerificationToken.findOne({ _user: data.id }, function(err, found) {
        if(err) {
          res.status(500).send({ msg: RESPONSE_MSGS.ERROR_500});
        }
        else if(found) {
          if(found.name.toLowerCase() == body.summonerName.toLowerCase()) {
            console.log("RETURNING CURRENT TOKEN");
            res.send({ verificationToken: found.token, summonerName: found.name });
          }
          else {
            riot.getSummonerByName(body.summonerName, function(summoner) {
              console.log("UPDATING TOKEN");
              found.name = summoner.name;
              found.summonerId = summoner.id;
              found.profileIconId = summoner.profileIconId;
              found.summonerLevel = summoner.summonerLevel;
              found.save(function(err) {
                if(err) {
                  console.log(err);
                  res.status(500).send({ msg: RESPONSE_MSGS.ERROR_500});
                }
                else {
                  res.send({ verificationToken: found.token, summonerName: summoner.name });
                }
              });
            });
          }
        }
        else {
          riot.getSummonerByName(body.summonerName, function(summoner) {
            var summonerVerificationToken = new SummonerVerificationToken({
              _user: data.id,
              name: summoner.name,
              summonerId: summoner.id,
              profileIconId: summoner.profileIconId,
              level: summoner.summonerLevel
            });
            summonerVerificationToken.createVerificationToken(function(err, token) {
              if(err) {
                res.status(500).send({msg: RESPONSE_MSGS.ERROR_500});
                console.log(err);
              }
              else {
                res.send({ verificationToken: token, summonerName: summoner.name });
              }
            });
          });
        }
      });
    }
  });
});

app.post('/summoner', function(req,res) {
  console.log(req.body.summonerName)
  SummonerVerificationToken.findOne({ name: req.body.summonerName }, function(err, found) {
    if(err) {
      return res.status(500).send({ msg: RESPONSE_MSGS.ERROR_500});
    }
    else if(found) {
      riot.getMasteriesById(found.summonerId, function(masteries) {
        var isValid = false;
        for(var i in masteries) {
          if(masteries[i].name == found.token) {
            isValid = true;
          }
        }
        if(isValid) {
          riot.getRankedById(found.summonerId, function(stats) {
            User.findOne({ _id: found._user }, function(err, user) {
              if(err) {
                return res.status(500).send({msg: RESPONSE_MSGS.ERROR_500 });
              }
              else if(found) {
                var summoner = new Summoner({
                  _id: found.summonerId,
                  _user: found._user,
                  name: found.name,
                  profileIconId: found.profileIconId,
                  level: found.level,
                  rankedStats: {
                    soloQ: {
                      divisionName: stats.name,
                      tier: stats.tier,
                      division: stats.entries[0].division,
                      leaguePoints: stats.entries[0].leaguePoints,
                      entry: {
                        isFreshBlood: stats.entries[0].isFreshBlood,
                        isHotStreak: stats.entries[0].isHotStreak,
                        isInactive: stats.entries[0].isInactive,
                        isVeteran: stats.entries[0].isVeteran,
                        playstyle: stats.entries[0].playstyle,
                        wins: stats.entries[0].wins,
                        losses: stats.entries[0].losses
                      }
                    }
                  }
                });
                summoner.save(function(err) {
                  if(err) {
                    res.status(500).send({ msg: RESPONSE_MSGS.ERROR_500 });
                  }
                  else {
                    found.remove();
                    user._summoner = summoner._id;
                    user.save(function(err) {
                      if(err) {
                        res.status(500).send({ msg: RESPONSE_MSGS.ERROR_500 });
                      }
                      else {
                        user = user.toObject();
                        delete user.password;
                        res.send({summoner: summoner.toObject(), user: user});
                      }
                    })
                  }
                });
              }
              else {
                return res.status(500).send({ msg: RESPONSE_MSGS.ERROR_500 });
              }
            });
          });
        }
        else {
          res.status(404).send({ msg: "Could not verify your summoner account. Please make sure that you have correctly copied the code into your mastery page and try again."});
        }
      });
    }
    else {
      res.status(404).send({msg: RESPONSE_MSGS.ERROR_500});
    }
  });
});



// Starts the server on port 3000!
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
