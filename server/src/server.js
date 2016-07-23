var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongo_express = require('mongo-express/lib/middleware');
// Use default Mongo Express configuration
var mongo_express_config = require('mongo-express/config.default.js');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://Kai:namu@ds051595.mlab.com:51595/unilol';

/**
 * Strips a password from a user object.
 */
function stripPassword(user) {
  if (user !== null) {
    delete user.password;
  }
  return user;
}

MongoClient.connect(url, function(err, db) {
  app.use(bodyParser.text());
  app.use(bodyParser.json());
  app.use(express.static('../client/build'));
  app.use('/mongo_express', mongo_express(mongo_express_config));
  if(err) {
    throw new Error("Could not connect to database: " + err);
  } else {
    console.log("Connecte correctly to server.");
  }
});
