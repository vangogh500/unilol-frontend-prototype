var https = require('https');

var apiToken = '6655b3f3-53b1-4556-89ca-afef644a5f17';


function makeRequest(opts, callback) {
	https.request(opts, function(res) {
		var data = '';
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('error', function(e) {
			console.log(e);
		});
		res.on('end', function() {
			console.log(opts.path + " : " + res.statusCode);
			callback(JSON.parse(data));
		});
	}).end();
}


exports.getSummonerByName = function(summonerName, cb){
	var opts = {
			hostname: 'na.api.pvp.net',
			method: 'GET',
			path: '/api/lol/na/v1.4/summoner/by-name/' + summonerName,
			headers: {
				'X-Riot-Token': apiToken
			}
	};
	makeRequest(opts, function(data) {
		cb(data[summonerName.toLowerCase()]);
	});
};

exports.getMasteriesById = function(summonerId, cb) {
	var opts = {
		hostname: 'na.api.pvp.net',
		method: 'GET',
		path: '/api/lol/na/v1.4/summoner/' + summonerId + '/masteries',
		headers: {
			'X-Riot-Token': apiToken
		}
	};
	makeRequest(opts, function(data) {
		cb(data[summonerId].pages);
	});
}

exports.getRankedById = function(summonerId, cb) {
	var opts = {
		hostname: 'na.api.pvp.net',
		method: 'GET',
		path: '/api/lol/na/v2.5/league/by-summoner/' + summonerId + '/entry',
		headers: {
			'X-Riot-Token': apiToken
		}
	};
	makeRequest(opts, function(data) {
		var entries = data[summonerId];
		for(var i in entries) {
			if(entries[i].queue == 'RANKED_SOLO_5x5') {
				return cb(entries[i]);
			}
		}
		return cb();
	});
}

exports.getRankedByIds = function(summonerIds, cb) {
	var opts = {
		hostname: 'na.api.pvp.net',
		method: 'GET',
		path: '/api/lol/na/v2.5/league/by-summoner/' + summonerIds + '/entry',
		headers: {
			'X-Riot-Token': apiToken
		}
	};
	makeRequest(opts, function(data) {
		Object.keys(data).map(function(id) {
			var entries = data[id]
			for(var i in entries) {
				if(entries[i].queue == 'RANKED_SOLO_5x5')  {
					return data[id] = entries[i]
				}
			}
			return data[id] = null
		})
		cb(data)
	});
}
