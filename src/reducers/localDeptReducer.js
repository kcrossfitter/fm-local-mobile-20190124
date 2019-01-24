import {
  GET_LOCALDEPTS,
  GET_LOCALDEPT,
  LOADING_LOCALDEPT,
  LOADING_LOCALDEPT_END
} from '../actions/types'

const initialState = {
  localDepts: null,
  localDept: null,
  loading: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING_LOCALDEPT:
      return {
        ...state,
        loading: true
      }
    case LOADING_LOCALDEPT_END:
      return {
        ...state,
        loading: false
      }
    case GET_LOCALDEPTS:
      return {
        ...state,
        localDepts: action.payload,
        loading: false
      }
    case GET_LOCALDEPT:
      return {
        ...state,
        localDept: action.payload,
        loading: false
      }
    default:
      return state
  }
}
