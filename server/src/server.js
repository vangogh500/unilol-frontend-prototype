// Imports the express Node module.
var express = require('express');
// Creates an Express server.
var app = express();
// import all libraries
var bodyParser = require('body-parser');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
mongoose.connect('mongodb://KaiMatsuda:namumyo@ds051595.mlab.com:51595/unilol')
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
var util = require('./util.js')

// connect to db

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
var School = require('./models/school.js')
var Event = require('./models/event.js')

var RESPONSE_MSGS = require('./serverResponseMsgs.js')

// Cron Jobs
/*
var CronJob = require('cron').CronJob
new CronJob('00 * * * * *', function() {
  console.log("Checking schools to update...")
  util.updateSchools()
}, null, true, 'America/Los_Angeles');
*/

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
 *  2. check that the domain of @email is associated with an existing school
 *  2. hash and salt @password
 *  3. create email verification token (store @email and hashed/salted @password)
 *  4. email verification link to @email
 * response codes:
 *  200: success
 *  401: user with email already exists
 *  404: school with domain could not be found
 *  500: database error, bcrypt error, nodemailer error
 */
app.post('/emailVerificationToken', function(req, res) {
  const ERROR_401 = "A user with the following email already exists."
  const ERROR_404 = "Sorry we couldn't find your school within our community. Please let us know if you think it should."
  const SUCCESS_200 = "Success! Please check your email for a verification link."
  var user = req.body;
  user.email = user.email.trim().toLowerCase();
  User.findOne({email: user.email}, function(error, found) {
    if(error) {
      res.status(500).send({msg: RESPONSE_MSGS.RESPONSE_MSGS.ERROR_500});
    }
    else if(found) {
        res.status(401).send({msg: ERROR_401})
    }
    else {
      var domain = user.email.split('@')[1].split('.')[0];
      School.findOne({ domain: domain}, function(err, school) {
        if(err) {
          res.status(500).send({msg: RESPONSE_MSGS.RESPONSE_MSGS.ERROR_500});
        }
        else if(school) {
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
        else {
          res.status(404).send({msg: ERROR_404})
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
 *  3. add user id to school roster field
 *  4. delete verification token
 * response codes:
 *  200: success
 *  401: invalid token
 *  500: database error
 */
app.post('/user', function(req, res) {
  const SUCCESS_200 = "Success! You may now login with your email and password.";
  const ERROR_401 = "Uh oh. Invalid verification link.";
  EmailVerificationToken.findOne({token: req.body.token}, function(err, token) {
    if(err) {
      res.status(500).send({msg: RESPONSE_MSGS.ERROR_500})
    }
    else if(token) {
      var domain = token.email.split('@')[1].split('.')[0]
      School.findOne({ domain: domain}, function(err, school) {
        if(err) {
          res.status(500).send({msg: RESPONSE_MSGS.ERROR_500})
        }
        else if(school) {
          var newUser = new User({email: token.email, password: token.password});
          newUser.save(function(err) {
            if(err) {
              res.status(500).send({msg: RESPONSE_MSGS.ERROR_500})
            }
            else {
              token.remove();
              school.roster.push(newUser._id);
              school.save(function(err) {
                if(err) {
                  res.status(500).send({msg: RESPONSE_MSGS.ERROR_500})
                }
                else {
                  res.send({msg: SUCCESS_200})
                }
              });
            }
          });
        }
        else {
          res.status(500).send({msg: RESPONSE_MSGS.ERROR_500})
        }
      });
    }
    else {
      res.status(401).send({msg: ERROR_401});
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
 *  3. create json web token
 *  3. get school data and check/get summoner data
 *  4. return token, user, school, and summoner
 * response codes:
 *  200: success
 *  400: bad request
 *  401: password or email is incorrect
 *  500: database error, bcrypt error
 * @return: token, user, summoner, school
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
    }
    else if(found) {
      bcrypt.compare(loginData.password, found.password, function(err, success) {
        if(err) {
          res.status(500).send({msg: RESPONSE_MSGS.ERROR_500});
        }
        else if(success) {
          jwt.sign({id: found._id}, secretKey, { expiresIn: '7 days'}, function(token) {
            found = found.toObject();
            delete found.password;
            var domain = found.email.split('@')[1].split('.')[0];
            School.findOne({ domain: domain }, function(err, school) {
              if(err) {
                res.status(500).send({msg: RESPONSE_MSGS.ERROR_500})
              }
              else if(school) {
                school = school.toObject()
                util.syncSchool(school, function(err, syncSchool) {
                  if(err) {
                    res.status(500).send({msg: RESPONSE_MSGS.ERROR_500})
                  }
                  if(found._summoner) {
                    Summoner.findOne({ _id: found._summoner }, function(err, summoner) {
                      if(err) {
                        res.status(500).send({msg: RESPONSE_MSGS.ERROR_500})
                      }
                      else if(summoner) {
                        summoner = summoner.toObject()
                        res.send({
                          user: found,
                          token: token,
                          summoner: summoner,
                          school: syncSchool
                        });
                      }
                      else {
                        res.status(500).send({msg: RESPONSE_MSGS.ERROR_500});
                      }
                    });
                  }
                  else {
                    res.send({
                      user: found,
                      token: token,
                      school: syncSchool
                    });
                  }
                })
              }
              else {
                res.status(500).send({msg: RESPONSE_MSGS.ERROR_500});
              }
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

/**
 * REQUIRES TOKEN
 * Update User Profile
 * verb: PUT
 * path: '/user'
 * @param: profile
 * logic:
 *  1. check token
 *  2. find user
 *  3. update profile and save
 *  4. return updated user
 * response codes:
 *  200: success
 *  401: password or email is incorrect
 *  500: database error
 * @return: user
 */
app.put('/user', function(req, res) {
  const ERROR_401 = "Uh oh. Something went wrong. Please try logging in again."
  var authorizationLine = req.headers.authorization;
  var token = authorizationLine.slice(7);
  jwt.verify(token, secretKey, function(err, data) {
    if(err) {
      res.status(401).send({ msg: ERROR_401 });
    }
    else {
      var user = req.body;
      User.findOne({ _id: data.id, email: user.email }, function(err, found) {
        if(err) {
          res.status(500).send({ msg: RESPONSE_MSGS.ERROR_500});
        }
        else if(found) {
          found.profile = user.profile
          found.save(function(err) {
            if(err) {
              res.status(500).send({ msg: RESPONSE_MSGS.ERROR_500});
            }
            else {
              found = found.toObject();
              delete found.password;
              res.send({user: found });
            }
          })
        }
        else {
          res.status(401).send({ msg: ERROR_401});
        }
      });
    }
  });
});

/**
 * REQUIRES TOKEN
 * Create summoner verification token
 * verb: POST
 * path: '/summonerVerificationToken'
 * logic:
 *  1. check that token doesn't already exist (if it does update the current token with new summoner information and send it back)
 *  2. call riot api and create new token using the information
 *  3. send back token and summoner name
 * response codes:
 *  200: success
 *  401: password or email is incorrect
 *  500: database error
 * @return: verificationToken, summonerName
 */
app.post('/summonerVerificationToken', function(req, res) {
  const ERROR_401 = "Uh oh. Something went wrong. Please try logging in again."
  var authorizationLine = req.headers.authorization;
  var token = authorizationLine.slice(7);
  jwt.verify(token, secretKey, function(err, data) {
    if(err) {
      res.status(401).send({ msg: ERROR_401});
    }
    else {
      var body = req.body;
      SummonerVerificationToken.findOne({ _user: data.id }, function(err, found) {
        if(err) {
          res.status(500).send({ msg: RESPONSE_MSGS.ERROR_500});
        }
        else if(found) {
          if(found.name.toLowerCase() == body.summonerName.toLowerCase()) {
            res.send({ verificationToken: found.token, summonerName: found.name });
          }
          else {
            riot.getSummonerByName(body.summonerName, function(summoner) {
              found.name = summoner.name;
              found.summonerId = summoner.id;
              found.profileIconId = summoner.profileIconId;
              found.summonerLevel = summoner.summonerLevel;
              found.save(function(err) {
                if(err) {
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

/**
 * Verify summoner verification token and create summoner
 * verb: POST
 * path: '/summoner'
 * @param: summonerName
 * logic:
 *  1. find summoner verification token using @summonerName
 *  2. check mastery pages of the summonerName via riot api
 *  3. get ranked info via riot api and create new summoner
 *  4. add summoner ref to user
 *  5. return updated user and updated summoner
 * response codes:
 *  200: success
 *  401: password or email is incorrect
 *  500: database error
 * @return: user, summoner
 */
app.post('/summoner', function(req,res) {
  const ERROR_401 = "Could not verify your summoner account. Please make sure that you have correctly copied the code into your mastery page and try again."
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
              else if(user) {
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
          res.status(401).send({ msg: ERROR_401 });
        }
      });
    }
    else {
      res.status(401).send({msg: ERROR_401});
    }
  });
});

app.post('/school', function(req, res) {
  var data = req.body;
  var school = new School({
    _id: data.id,
    bannerUrl: data.bannerUrl,
    domain: data.domain,
    roster: [],
    admins: []
  });
  school.save(function(err) {
    if(err) {
      res.status(500).send({ msg: RESPONSE_MSGS.ERROR_500});
    }
    else {
      res.send();
    }
  });
});

app.post('/event', function(req, res) {
  var data = req.body;
  var event = new Event({
    name: data.name,
    date: data.date,
    location: data.location,
    url: data.url,
    participants: [],
    createdBy: '57c3d0c459cfce9c039a5c64',
    organizers: ['57c3d0c459cfce9c039a5c64']
  })
  event.save(function(err) {
    if(err) {
      res.status(500).send({ msg: RESPONSE_MSGS.ERROR_500});
    }
    else {
      res.send();
    }
  });
});

app.get('/school/:id', function(req,res) {
  School.findOne({ _id: req.params.id }).populate({
    path: 'roster',
    model: 'User',
    select: '_summoner profile',
    populate: {
      path: '_summoner',
      model: 'Summoner',
      select: 'name profileIconId level rankedStats'
    }}).populate('events').exec(function(err,school) {
    if(err) {
      res.status(500).send({ msg: RESPONSE_MSGS.ERROR_500 })
    }
    else if(school) {
      res.send({school: school})
    }
    else {
      res.status(404).send({ msg: "School not found."})
    }
  });
})

app.get('/user/:id', function(req,res) {
  console.log(req.params.id)
  User.findOne({_id: req.params.id}, "email profile _summoner").populate("_summoner").exec(function(err,user) {
    if(err) {
      res.status(500).send({ msg: RESPONSE_MSGS.ERROR_500 })
    }
    else if(user) {
      School.findOne({ domain: user.email.split('@')[1].split('.')[0] }, "_id name admins", function(err, school) {
        if(err) {
          res.status(500).send({ msg: RESPONSE_MSGS.ERROR_500 })
        }
        else if(school) {
          user = user.toObject()
          user.school = school
          res.send({user: user})
        }
        else {
          res.status(500).send({ msg: RESPONSE_MSGS.ERROR_500 })
        }
      })
    }
    else {
      res.status(404).send({ msg: "User not found."})
    }
  })
})

// TODO: Case where user is already in the database participants
app.post('/events/rsvp/:id', function(req, res) {
  const ERROR_401 = "Uh oh. Something went wrong. Please try logging in again."
  var authorizationLine = req.headers.authorization;
  var token = authorizationLine.slice(7);
  console.log(token)

  Event.findOne({_id: req.params.id}, "participants", function(err, event) {
    if(err) {
      res.status(500).send({ msg: RESPONSE_MSGS.ERROR_500 })
    }
    else if(event){
      jwt.verify(token, secretKey, function(err, data) {
        if(err) {
          console.log(err)
          res.status(401).send({ msg: ERROR_401});
        }
        else {
          event.participants.push(data.id)
          event.save()
          res.send()
        }
      })
    }
    else {
      res.status(404).send({ msg: "Event not found."})
    }
  })
});


// Starts the server on port 3000!
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
