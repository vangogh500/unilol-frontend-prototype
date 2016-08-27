import { signIn } from './server'
import { hashHistory } from 'react-router'
import { saveUserToStorage, saveTokenToStorage, getUserFromStorage, getTokenFromStorage } from './util'

/*
 * Action types
 */
export const REQUEST_REGISTER = "REQUEST_REGISTER"
export const REGISTER_SUCCESS = "REGISTER_SUCCESS"
export const REGISTER_FAILURE = "REGISTER_FAILURE"

export const LOGIN_SUCCESS = "LOGIN_SUCCESS"

export const UPDATE_USER = "UPDATE_USER"

export const LOGOUT = "LOGOUT"

/*
 * Action creators
 */
function register(userData) {
  return { type: REGISTER, userData }
}
function requestLogin() {
  return { type: REQUEST_LOGIN }
}
function loginSuccess(authData) {
  return {type: LOGIN_SUCCESS, authData }
}

export function login(authData) {
  return function(dispatch) {
    saveUserToStorage(authData.user)
    saveTokenToStorage(authData.token)
    dispatch(loginSuccess(authData))
    hashHistory.push('/profile')
  }
}

export function loginFromStorage() {
  return function(dispatch) {
    var user = getUserFromStorage()
    var token = getTokenFromStorage()
    dispatch(loginSuccess({ user: user, token: token}))
  }
}

export function updateUser(user) {
  saveUserToStorage(user)
  return { type: UPDATE_USER, user }
}
