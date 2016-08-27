// User Schema

var mongoose = require('mongoose');

var StatsSchema = mongoose.Schema({
  soloQ: {
    divisionName: { type: String, required: true },
    tier: { type: String, required: true},
    division: { type: String, required: true},
    leaguePoints: { type: Number, required: true},
    entry: {
      isFreshBlood: Boolean,
      isHotStreak: Boolean,
      isInactive: Boolean,
      isVeteran: Boolean,
      playstyle: String,
      wins: {type: Number, required: true },
      losses: {type: Number, required: true }
    }
  }
}, { _id: false });

var SummonerSchema = mongoose.Schema({
  _id: {type: Number, required: true, unique: true },
  _user: {type: String, required: true, ref: 'User'},
  name: {type: String, required: true },
  profileIconId: {type: Number, required: true},
  level: {type: String, required: true },
  rankedStats: StatsSchema
});

module.exports = mongoose.model('Summoner', SummonerSchema);
