/*
 * Functions for dealing with local storage
 *  functions: saveUserToStorage, saveTokenToStorage, saveSummonerToStorage, saveSchoolToStorage
 *  getUserFromStorage, getTokenFromStorage, getSummonerFromStorage, getSchoolFromStorage
 */

export function saveUserToStorage(user) {
  if (typeof(Storage) !== "undefined") {
    if(user) {
      localStorage.setItem('user', JSON.stringify(user))
    }
    else {
      localStorage.removeItem('user')
    }
  }
}

export function saveTokenToStorage(token) {
  if (typeof(Storage) !== "undefined") {
    if(token) {
      localStorage.setItem('token', JSON.stringify(token))
    }
    else {
      localStorage.removeItem('token')
    }
  }
}

export function saveSummonerToStorage(summoner) {
  if (typeof(Storage) !== "undefined") {
    if(summoner) {
      localStorage.setItem('summoner', JSON.stringify(summoner))
    }
    else {
      localStorage.removeItem('summoner')
    }
  }
}

export function saveSchoolToStorage(school) {
  if (typeof(Storage) !== "undefined") {
    if(school) {
      localStorage.setItem('school', JSON.stringify(school))
    }
    else {
      localStorage.removeItem('school')
    }
  }
}

export function getUserFromStorage() {
  if (typeof(Storage) !== "undefined") {
    return JSON.parse(localStorage.getItem('user'))
  }
  return
}

export function getTokenFromStorage() {
  if (typeof(Storage) !== "undefined") {
    return JSON.parse(localStorage.getItem('token'))
  }
  return
}

export function getSummonerFromStorage() {
  if (typeof(Storage) !== "undefined") {
    return JSON.parse(localStorage.getItem('summoner'))
  }
  return
}

export function getSchoolFromStorage() {
  if (typeof(Storage) !== "undefined") {
    return JSON.parse(localStorage.getItem('school'))
  }
  return
}

function divisionToLP(division) {
  switch(division) {
    case "I":
      return 4000
    case "II":
      return 3000
    case "III":
      return 2000
    case "IV":
      return 1000
    case "V":
      return 0
  }
}

function tierToLP(tier) {
  switch(tier) {
    case "CHALLENGER":
      return 50000
    case "MASTER":
      return 40000
    case "DIAMOND":
      return 30000
    case "PLATINUM":
      return 20000
    case "GOLD":
      return 10000
    case "SILVER":
      return 10000
    case "Bronze":
      return 0
  }
}

function getUserLP(user) {
 return tierToLP(user._summoner.rankedStats.soloQ.tier) + divisionToLP(user._summoner.rankedStats.soloQ.division) + user._summoner.rankedStats.soloQ.leaguePoints
}

export function sortRosterByLP(roster) {
  roster.sort(function(user1, user2) {
    return getUserLP(user2) - getUserLP(user1)
  })
  return roster
}

function dayDiff(first, second) {
  var diff = (second-first)/(1000*60*60*24)
  if(diff < 0) {
    return Math.ceil(diff)
  }
  else {
    return Math.floor(diff)
  }
}

function roundHour(date, includeLabel) {
  var hours = date.getHours()
  var label
  var minutes = date.getMinutes()
  if(minutes >= 30) {
    hours + 1
  }
  if(hours == 0) {
    hours = 12
    label = "AM"
  }
  else if(hours <= 11) {
    label = "AM"
  }
  else if(hours == 12) {
    label = "PM"
  }
  else if(hours > 12) {
    hours = (hours - 12)
    label = "PM"
  }

  if(includeLabel) {
    return hours + " " + label
  }
  else {
    return hours
  }
}

function dateToString(date, includeLabel) {
  var diff = dayDiff(new Date(Date.now()), date)
  if(diff < 7) {
    var day
    if(diff == 0) {
      day = "Today"
    }
    else if(diff == -1) {
      day = "Yesterday"
    }
    else if(diff == 1) {
      day = "Tomorrow"
    }
    else {
      day = (() => {
       switch(date.getDay()) {
         case 0: return "Sunday"
         case 1: return "Monday"
         case 2: return "Tuesday"
         case 3: return "Wednesday"
         case 4: return "Thursday"
         case 5: return "Friday"
         case 6: return "Saturday"
       }
     })()
    }
    return day + " " + roundHour(date, includeLabel)
  }
  else {
    return (date.getMonth()+1) + '/' + date.getDate() + '/' + (date.getFullYear() + "").slice(-2) + " " + roundHour(date, includeLabel)
  }
}

export function formatDate(startDate, endDate) {
  var localStart = new Date(new Date(startDate).getTime())
  if(endDate) {
    var localEnd = new Date(new Date(endDate).getTime())
    var diff = dayDiff(localStart, localEnd)
    if(diff == 0) {
      return dateToString(localStart, false) + " - " + roundHour(localEnd, true)
    }
    else {
      return dateToString(localStart, true) + " - " + dateToString(localEnd, true)
    }
  }
  else {
    return dateToString(localStart, true)
  }
}
