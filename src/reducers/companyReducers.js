import {
  GET_COMPANIES,
  GET_COMPANY,
  ADD_COMPANY,
  MODIFY_COMPANY,
  DELETE_COMPANY,
  LOADING_COMPANY,
  LOADING_COMPANY_END
} from '../actions/types'

const initialState = {
  companies: null,
  company: null,
  loading: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOADING_COMPANY:
      return {
        ...state,
        loading: true
      }
    case LOADING_COMPANY_END:
      return {
        ...state,
        loading: false
      }
    case GET_COMPANIES:
      return {
        ...state,
        companies: action.payload,
        loading: false
      }
    case GET_COMPANY:
      return {
        ...state,
        company: action.payload,
        loading: false
      }
    case ADD_COMPANY:
      return {
        ...state,
        companies: [...state.companies, action.payload],
        loading: false
      }
    case MODIFY_COMPANY:
      return {
        ...state,
        companies: state.companies.map(company =>
          company._id === action.payload._id ? action.payload : company
        ),
        company: action.payload
      }
    case DELETE_COMPANY:
      return {
        ...state,
        companies: state.companies.filter(
          company => company._id !== action.payload._id
        ),
        loading: false
      }
    default:
      return state
  }
}
