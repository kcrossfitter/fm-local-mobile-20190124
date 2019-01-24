import isEmpty from '../validation/isEmpty'
import {
  SET_CURRENT_USER,
  START_AUTHENTICATING,
  STOP_AUTHENTICATING
} from '../actions/types'

const initialState = {
  isAuthenticated: false,
  user: {},
  authenticating: false
}

export default function(state = initialState, action) {
  switch (action.type) {
    case START_AUTHENTICATING:
      return {
        ...state,
        authenticating: true
      }
    case STOP_AUTHENTICATING:
      return {
        ...state,
        authenticating: false
      }
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        authenticating: false
      }
    default:
      return state
  }
}
