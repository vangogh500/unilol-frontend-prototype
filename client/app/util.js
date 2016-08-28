
export function saveUserToStorage(user) {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem('user', JSON.stringify(user))
  }
}

export function saveTokenToStorage(token) {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem('token', JSON.stringify(token))
  }
}

export function saveSummonerToStorage(summoner) {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem('summoner', JSON.stringify(summoner))
  }
}

export function saveSchoolToStorage(school) {
  if (typeof(Storage) !== "undefined") {
    localStorage.setItem('school', JSON.stringify(school))
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
  if (typeof(Storage) !== "undefined" && localStorage.getItem('summoner') !== 'undefined') {
    return JSON.parse(localStorage.getItem('summoner'))
  }
  return
}

export function getSchoolFromStorage() {
  if (typeof(Storage) !== "undefined" && localStorage.getItem('school') !== 'undefined') {
    return JSON.parse(localStorage.getItem('school'))
  }
  return
}
