import { signIn } from './server'
import { browserHistory } from 'react-router'


/*
 * Action types
 */
export const REQUEST_REGISTER = "REQUEST_REGISTER"
export const REGISTER_SUCCESS = "REGISTER_SUCCESS"
export const REGISTER_FAILURE = "REGISTER_FAILURE"

export const REQUEST_LOGIN = "REQUEST_LOGIN"
export const LOGIN_SUCCESS = "LOGIN_SUCCESS"
export const LOGIN_FAILURE = "LOGIN_FAILURE"

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
    dispatch(loginSuccess(authData))
    browserHistory.push('/profile')
  }
}
