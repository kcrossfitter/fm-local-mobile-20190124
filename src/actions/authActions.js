import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { AsyncStorage } from 'react-native'

import setAuthToken from '../util/setAuthToken'
import { getErrors, clearErrors } from './errorActions'
import handleActionError from './handleActionError'

import {
  SET_CURRENT_USER,
  START_AUTHENTICATING,
  STOP_AUTHENTICATING
} from './types'
import { BASE_URL } from '../config'

const AUTH_URL = '/api/users'

const startAuthenticating = () => ({
  type: START_AUTHENTICATING
})

const stopAuthenticating = () => ({
  type: STOP_AUTHENTICATING
})

export const setCurrentUser = decoded => ({
  type: SET_CURRENT_USER,
  payload: decoded
})

// Register user
export const registerUser = (userData, navigate) => async dispatch => {
  dispatch(startAuthenticating())

  try {
    await axios({
      url: `${BASE_URL}${AUTH_URL}/register`,
      method: 'post',
      data: userData,
      headers: {
        'user-type': 'local'
      }
    })

    dispatch(stopAuthenticating())
    dispatch(clearErrors())

    navigate('SignIn')
  } catch (err) {
    // for debugging purpose, later delete
    console.log('handleActionError(err)', handleActionError(err))

    // set authenticating to false to remove spinner
    dispatch(stopAuthenticating())

    // set errors for user
    dispatch(getErrors(handleActionError(err)))
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Login in = get user token
export const loginUser = (userData, navigate) => async dispatch => {
  // Set isAuthenticated to true
  dispatch(startAuthenticating())

  // await sleep(1000)

  try {
    const res = await axios({
      url: `${BASE_URL}${AUTH_URL}/login`,
      method: 'post',
      data: userData,
      headers: {
        'user-type': 'local'
      }
    })

    // res.data => { success: true, token: `Bearer ${token}` }
    const { token } = res.data

    await AsyncStorage.setItem('jwtToken', token)

    // set common header for axios request as Bearer
    setAuthToken(token)

    // Decode token to get user data
    // jwt_decode correctly decode the following format also
    // 'Bearer kdfkdjf.fk39dfdkjfdf.kfjkdjcc33@#'
    // needless to say 'kdfkdjf.fk39dfdkjfdf.kfjkdjcc33@#'
    const decoded = jwt_decode(token)
    // console.log('decoded', decoded)

    // set current user
    dispatch(setCurrentUser(decoded))

    // Authentication process end
    dispatch(stopAuthenticating())

    // clear any remaining errors
    dispatch(clearErrors())

    // go to dashboard
    navigate('Main')
  } catch (err) {
    // for debugging purpose, later delete
    console.log('handleActionError(err)', handleActionError(err))

    // set authenticating to false to remove spinner
    dispatch(stopAuthenticating())

    // set errors for user
    dispatch(getErrors(handleActionError(err)))
  }
}

export const logoutUser = () => async dispatch => {
  // Remove token from local storage
  await AsyncStorage.removeItem('jwtToken')

  // Remove auth header for future request
  setAuthToken(false)

  // Set the current user {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}))

  // clear any remaing errors
  dispatch(clearErrors())
}

// Change password
// 1. Change server database
// 2. Change location to login
// 3. Logout user
export const changePassword = (userData, navigate) => async dispatch => {
  dispatch(startAuthenticating())

  try {
    await axios({
      url: `${BASE_URL}${AUTH_URL}/change-password`,
      method: 'put',
      data: userData,
      headers: {
        'user-type': 'local'
      }
    })

    dispatch(stopAuthenticating())
    dispatch(logoutUser())
    dispatch(clearErrors())

    navigate('SignIn')
  } catch (err) {
    // for debugging purpose, later delete
    console.log('handleActionError(err)', handleActionError(err))

    // set authenticating to false to remove spinner
    dispatch(stopAuthenticating())

    // set errors for user
    dispatch(getErrors(handleActionError(err)))
  }
}
