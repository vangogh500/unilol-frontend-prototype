import { signIn } from './server'
import { hashHistory } from 'react-router'
import { saveUserToStorage, saveTokenToStorage, saveSummonerToStorage, saveSchoolToStorage, getUserFromStorage, getTokenFromStorage, getSummonerFromStorage, getSchoolFromStorage } from './util'

/*
 * Action types
 */
export const UPDATE = "UPDATE"
export const LOGOUT = "LOGOUT"

/*
 * Action creators
 */

/*
 * Update specified values of the store to the properties of the state
 *  state properties: token, user, summoner, school
 *
 */
function updateAction(state) {
  return { type: UPDATE, state }
}
function logoutAction() {
  return { type: LOGOUT }
}

// async actions
export function update(state) {
  return function(dispatch) {
    if(state.user) saveUserToStorage(state.user)
    if(state.token) saveTokenToStorage(state.token)
    if(state.summoner) saveSummonerToStorage(state.summoner)
    if(state.school) saveSchoolToStorage(state.school)
    dispatch(updateAction(state))
  }
}

export function login(authData) {
  return function(dispatch) {
    saveUserToStorage(authData.user)
    saveTokenToStorage(authData.token)
    saveSummonerToStorage(authData.summoner)
    saveSchoolToStorage(authData.school)
    dispatch(updateAction(authData))
    hashHistory.push('/profile')
  }
}

export function loginFromStorage() {
  return function(dispatch) {
    var user = getUserFromStorage()
    var token = getTokenFromStorage()
    var summoner = getSummonerFromStorage()
    var school = getSchoolFromStorage()
    dispatch(updateAction({ user: user, token: token, summoner: summoner, school: school }))
  }
}

export function logout() {
  return function(dispatch) {
    saveTokenToStorage(null)
    saveUserToStorage(null)
    saveSummonerToStorage(null)
    saveSchoolToStorage(null)
    dispatch(logoutAction())
    hashHistory.push('/')
  }
}
