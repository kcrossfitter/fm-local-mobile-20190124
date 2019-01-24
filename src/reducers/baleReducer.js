import {
  GET_BALES_LOCAL,
  GET_BALES_LOCAL_FARMER,
  GET_BALES_LOCAL_FARMER_PILJI,
  GET_BALE_LOCAL_FARMER_PILJI,
  GET_BALES_LOCAL_COMPANY,
  GET_BALES_LOCAL_COMPANY_PILJI,
  GET_BALE_LOCAL_COMPANY_PILJI,
  LOADING_BALE,
  LOADING_BALE_END
} from '../actions/types'

const initialState = {
  balesLocal: null,
  balesLocalFarmer: null,
  balesLocalFarmerPilji: null,
  baleLocalFarmerPilji: null,
  balesLocalCompany: null,
  balesLocalCompanyPilji: null,
  baleLocalCompanyPilji: null,
  loading: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING_BALE:
      return {
        ...state,
        loading: true
      }
    case LOADING_BALE_END:
      return {
        ...state,
        loading: false
      }
    case GET_BALES_LOCAL:
      return {
        ...state,
        balesLocal: action.payload,
        loading: false
      }
    case GET_BALES_LOCAL_FARMER:
      return {
        ...state,
        balesLocalFarmer: action.payload,
        loading: false
      }
    case GET_BALES_LOCAL_FARMER_PILJI:
      return {
        ...state,
        balesLocalFarmerPilji: action.payload,
        loading: false
      }
    case GET_BALE_LOCAL_FARMER_PILJI:
      return {
        ...state,
        baleLocalFarmerPilji: action.payload,
        loading: false
      }
    case GET_BALES_LOCAL_COMPANY:
      return {
        ...state,
        balesLocalCompany: action.payload,
        loading: false
      }
    case GET_BALES_LOCAL_COMPANY_PILJI:
      return {
        ...state,
        balesLocalCompanyPilji: action.payload,
        loading: false
      }
    case GET_BALE_LOCAL_COMPANY_PILJI:
      return {
        ...state,
        baleLocalCompanyPilji: action.payload,
        loading: false
      }

    default:
      return state
  }
}
