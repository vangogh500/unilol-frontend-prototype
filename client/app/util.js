
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
