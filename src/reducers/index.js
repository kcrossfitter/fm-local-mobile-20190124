import { combineReducers } from 'redux'

import applicationReducer from './applicationReducer'
import authReducer from './authReducer'
import baleReducer from './baleReducer'
import companyReducer from './companyReducers'
import errorReducer from './errorReducer'
import localDeptReducer from './localDeptReducer'

export default combineReducers({
  application: applicationReducer,
  auth: authReducer,
  bale: baleReducer,
  company: companyReducer,
  errors: errorReducer,
  local: localDeptReducer
})
