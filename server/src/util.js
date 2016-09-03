var bcrypt = require('bcryptjs');
var User = require('./models/user.js');
var School = require('./models/school.js')
var Summoner = require('./models/summoner.js')
var riot = require('./lib/riot')
var moment = require('moment')

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

exports.syncSchool = function(school, cb) {
  User.find( { _id: { $in: school.roster }}, "_summoner  profile").populate('_summoner', 'name profileIconId level rankedStats').exec(function(err, roster) {
    school.roster = roster
    cb(err, school)
  })
}

function updateRosterBySchoolId(id,cb) {
  console.log("update school : " + id)
  School.findOne({ _id: id}, 'roster').populate('roster').exec(function(err, school) {
    if(err) {
      cb(err, null)
    }
    else if(school) {
      var summoners = school.roster.map(function(user) { return user._summoner})
      const chunk_size = 10
      var requestBatches = summoners.map( function(e,i){
          return i%chunk_size===0 ? summoners.slice(i,i+chunk_size) : null
      })
      .filter(function(e){ return e; });
      for(var i in requestBatches) {
        riot.getRankedByIds(requestBatches[i].join(','), function(data) {
          for(var id in data) {
            var soloQ = {
              divisionName: data[id].name,
              tier: data[id].tier,
              division: data[id].entries[0].division,
              leaguePoints: data[id].entries[0].leaguePoints,
              miniSeries: data[id].entries[0].miniseries,
              entry: {
                isFreshBlood: data[id].entries[0].isFreshBlood,
                isHotStreak: data[id].entries[0].isHotStreak,
                isInactive: data[id].entries[0].isInactive,
                playStyle: data[id].entries[0].playstyle,
                wins: data[id].entries[0].wins,
                losses: data[id].entries[0].losses
              }
            }
            Summoner.findByIdAndUpdate(id, { $set: { 'name': data[id].entries[0].playerOrTeamName, 'rankedStats.soloQ': soloQ }}, function(err) {
              if(err) {
                console.log(err)
              }
            })
          }
        })
      }
      school.lastUpdate = Date.now()
      school.save()
    }
    else {
      cb(null, null)
    }
  })
}
 exports.updateSchools = function() {
   School.find({}, 'roster lastUpdate', function(err, schools) {
     for(var i in schools) {
       var duration = moment.duration(moment(Date.now()).diff(moment(schools[i].lastUpdate)))
       if(duration.asHours() > 48) {
         updateRosterBySchoolId(schools[i]._id)
       }
     }
   })
 }
