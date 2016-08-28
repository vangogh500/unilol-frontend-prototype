import { UPDATE_USER, LOGIN_SUCCESS, UPDATE_SUMMONER, LOGOUT } from './actions'

const initialState = {
  user: null,
  token: null,
  summoner: null
}

export default function unilol(state = initialState, action) {
  switch(action.type) {
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        user: action.authData.user,
        token: action.authData.token,
        summoner: action.authData.summoner,
        school: action.authData.school
      })
    case UPDATE_USER:
      return Object.assign({}, state, {
        user: action.user
      })
    case UPDATE_SUMMONER:
      return Object.assign({}, state, {
        summoner: action.summoner
      })
    case LOGOUT:
      return Object.assign({}, state, {
        user: null,
        token: null,
        summoner: null
      })
    default:
      return state
  }
}
