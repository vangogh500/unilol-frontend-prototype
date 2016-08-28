import { signIn } from './server'
import { hashHistory } from 'react-router'
import { saveUserToStorage, saveTokenToStorage, saveSummonerToStorage, saveSchoolToStorage, getUserFromStorage, getTokenFromStorage, getSummonerFromStorage, getSchoolFromStorage } from './util'

/*
 * Action types
 */
export const REQUEST_REGISTER = "REQUEST_REGISTER"
export const REGISTER_SUCCESS = "REGISTER_SUCCESS"
export const REGISTER_FAILURE = "REGISTER_FAILURE"

export const LOGIN_SUCCESS = "LOGIN_SUCCESS"

export const UPDATE_USER = "UPDATE_USER"
export const UPDATE_SUMMONER = "UPDATE_SUMMONER"
export const UPDATE_SCHOOL = "UPDATE_SCHOOL"

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

function logoutAction() {
  return { type: LOGOUT }
}

export function login(authData) {
  return function(dispatch) {
    saveUserToStorage(authData.user)
    saveTokenToStorage(authData.token)
    saveSummonerToStorage(authData.summoner)
    saveSchoolToStorage(authData.school)
    dispatch(loginSuccess(authData))
    hashHistory.push('/profile')
  }
}

export function loginFromStorage() {
  return function(dispatch) {
    var user = getUserFromStorage()
    var token = getTokenFromStorage()
    var summoner = getSummonerFromStorage()
    var school = getSchoolFromStorage()
    dispatch(loginSuccess({ user: user, token: token, summoner: summoner, school: school }))
  }
}

export function updateUser(user) {
  saveUserToStorage(user)
  return { type: UPDATE_USER, user }
}

export function updateSummoner(summoner) {
  saveSummonerToStorage(summoner)
  return { type: UPDATE_SUMMONER, summoner }
}

export function logout() {
  return function(dispatch) {
    console.log("logging out")
    saveTokenToStorage(null)
    saveUserToStorage(null)
    saveSummonerToStorage(null)
    dispatch(logoutAction())
    hashHistory.push('/')
  }
}
