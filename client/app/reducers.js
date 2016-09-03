/*
 * Reducers for the store
 */


import { UPDATE, LOGOUT } from './actions'

const initialState = {
  user: null,
  token: null,
  summoner: null,
  school: null
}

export default function unilol(state = initialState, action) {
  switch(action.type) {
    case UPDATE:
      return Object.assign({}, state, action.state)
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
