import { UPDATE_USER, LOGIN_SUCCESS } from './actions'

const initialState = {
  user: null,
  token: null
}

export default function unilol(state = initialState, action) {
  switch(action.type) {
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        fetching: false,
        user: action.authData.user,
        token: action.authData.token
      })
    case UPDATE_USER:
      return Object.assign({}, state, {
        user: action.user
      })
    default:
      return state
  }
}
