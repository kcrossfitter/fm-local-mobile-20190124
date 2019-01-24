import {
  GET_APPS_LOCAL,
  GET_APPS_LOCAL_FARMER,
  GET_APP_LOCAL_FARMER,
  GET_APPS_LOCAL_COMPANY,
  GET_APP_LOCAL_COMPANY,
  APPROVE_APP_LOCAL_FARMER,
  RETURN_APP_LOCAL_FARMER,
  LOADING_APPLICATION,
  LOADING_APPLICATION_END
} from '../actions/types'

const initialState = {
  appsLocal: null,
  appsLocalFarmer: null,
  appLocalFarmer: null,
  appsLocalCompany: null,
  appLocalCompany: null,
  loading: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING_APPLICATION:
      return {
        ...state,
        loading: true
      }
    case LOADING_APPLICATION_END:
      return {
        ...state,
        loading: false
      }
    case GET_APPS_LOCAL:
      return {
        ...state,
        appsLocal: action.payload,
        loading: false
      }
    case GET_APPS_LOCAL_FARMER:
      return {
        ...state,
        appsLocalFarmer: action.payload,
        loading: false
      }
    case GET_APP_LOCAL_FARMER:
      return {
        ...state,
        appLocalFarmer: action.payload,
        loading: false
      }
    case GET_APPS_LOCAL_COMPANY:
      return {
        ...state,
        appsLocalCompany: action.payload,
        loading: false
      }
    case GET_APP_LOCAL_COMPANY:
      return {
        ...state,
        appLocalCompany: action.payload,
        loading: false
      }
    case APPROVE_APP_LOCAL_FARMER:
      return {
        ...state,
        appsLocalFarmer: state.appsLocalFarmer.map(app =>
          app._id === action.payload._id ? action.payload : app
        ),
        appsLocal: state.appsLocal.map(app =>
          app._id === action.payload._id ? action.payload : app
        ),
        appsLocalCompany: state.appsLocalCompany.map(app =>
          app._id === action.payload._id ? action.payload : app
        ),
        appLocalFarmer: action.payload,
        loading: false
      }
    case RETURN_APP_LOCAL_FARMER:
      return {
        ...state,
        appsLocalFarmer: state.appsLocalFarmer.map(app =>
          app._id === action.payload._id ? action.payload : app
        ),
        appsLocal: state.appsLocal.map(app =>
          app._id === action.payload._id ? action.payload : app
        ),
        appsLocalCompany: state.appsLocalCompany.map(app =>
          app._id === action.payload._id ? action.payload : app
        ),
        appLocalFarmer: action.payload,
        loading: false
      }

    default:
      return state
  }
}
