import axios from 'axios'
import { AsyncStorage } from 'react-native'

import {
  GET_APPS_LOCAL,
  GET_APPS_LOCAL_FARMER,
  GET_APP_LOCAL_FARMER,
  GET_APPS_LOCAL_COMPANY,
  GET_APP_LOCAL_COMPANY,
  APPROVE_APP_LOCAL_FARMER,
  RETURN_APP_LOCAL_FARMER,
  LOADING_APPLICATION,
  LOADING_APPLICATION_END,
  GET_ERRORS
} from './types'
import handleActionError from './handleActionError'
import { BASE_URL } from '../config'

const APP_URL = '/api/forage-applications'

// Loading Indicator
const loadingApplication = () => ({
  type: LOADING_APPLICATION
})

const stopLoadingApplication = () => ({
  type: LOADING_APPLICATION_END
})

// 당해년도 특정 수확단 소관 모든 파종 신청 정보
export const getAppsLocal = localId => async dispatch => {
  dispatch(loadingApplication())

  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken')
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}${APP_URL}/local/${localId}`,
      headers: {
        'user-type': 'local',
        Authorization: jwtToken
      }
    })

    // console.log('res', res.data)

    dispatch({
      type: GET_APPS_LOCAL,
      payload: res.data
    })

    dispatch(stopLoadingApplication())
  } catch (err) {
    dispatch(stopLoadingApplication())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const getAppsLocalFarmer = (localId, farmerId) => async dispatch => {
  dispatch(loadingApplication())

  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken')
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}${APP_URL}/local/farmer/${localId}/${farmerId}`,
      headers: {
        'user-type': 'local',
        Authorization: jwtToken
      }
    })

    dispatch({
      type: GET_APPS_LOCAL_FARMER,
      payload: res.data
    })

    dispatch(stopLoadingApplication())
  } catch (err) {
    dispatch(stopLoadingApplication())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const getAppLocalFarmer = (localId, appId) => async dispatch => {
  dispatch(loadingApplication())

  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken')
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}${APP_URL}/local/farmer/${localId}/${appId}`,
      headers: {
        'user-type': 'local',
        Authorization: jwtToken
      }
    })

    dispatch({
      type: GET_APP_LOCAL_FARMER,
      payload: res.data
    })

    dispatch(stopLoadingApplication())
  } catch (err) {
    dispatch(stopLoadingApplication())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const getAppsLocalCompany = (localId, companyId) => async dispatch => {
  dispatch(loadingApplication())

  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken')
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}${APP_URL}/local/company/${localId}/${companyId}`,
      headers: {
        'user-type': 'local',
        Authorization: jwtToken
      }
    })

    dispatch({
      type: GET_APPS_LOCAL_COMPANY,
      payload: res.data
    })

    dispatch(stopLoadingApplication())
  } catch (err) {
    dispatch(stopLoadingApplication())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const getAppLocalCompany = (localId, appId) => async dispatch => {
  dispatch(loadingApplication())

  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken')
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}${APP_URL}/local/company/${localId}/${appId}`,
      headers: {
        'user-type': 'local',
        Authorization: jwtToken
      }
    })

    dispatch({
      type: GET_APP_LOCAL_COMPANY,
      payload: res.data
    })

    dispatch(stopLoadingApplication())
  } catch (err) {
    dispatch(stopLoadingApplication())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const approveAppLocalFarmer = (
  localId,
  appId,
  farmerId
) => async dispatch => {
  dispatch(loadingApplication())

  try {
    const res = await axios({
      method: 'put',
      url: `${BASE_URL}/local/${localId}/${farmerId}/${appId}/approve`,
      headers: {
        'user-type': 'local'
      }
    })

    dispatch({
      type: APPROVE_APP_LOCAL_FARMER,
      payload: res.data
    })

    dispatch(stopLoadingApplication())
  } catch (err) {
    dispatch(stopLoadingApplication())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const returnAppLocalFarmer = (
  localId,
  appId,
  returnReason,
  farmerId
) => async dispatch => {
  dispatch(loadingApplication())

  try {
    const res = await axios({
      method: 'put',
      url: `${BASE_URL}/local/${localId}/${farmerId}/${appId}/return`,
      data: { returnReason },
      headers: {
        'user-type': 'local'
      }
    })

    dispatch({
      type: RETURN_APP_LOCAL_FARMER,
      payload: res.data
    })

    dispatch(stopLoadingApplication())
  } catch (err) {
    dispatch(stopLoadingApplication())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const addApplication = (
  companyId,
  applicationData
) => async dispatch => {
  dispatch(loadingApplication())

  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken')
    const res = await axios({
      method: 'post',
      url: `${BASE_URL}${APP_URL}/company/${companyId}`,
      data: applicationData,
      headers: {
        'user-type': 'agency',
        Authorization: jwtToken
      }
    })

    dispatch({
      type: ADD_APPLICATION,
      payload: res.data
    })

    dispatch(stopLoadingApplication())
  } catch (err) {
    dispatch(stopLoadingApplication())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const editApplication = (
  companyId,
  applicationId,
  applicationData
) => async dispatch => {
  dispatch(loadingApplication())

  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken')
    const res = await axios({
      method: 'put',
      url: `${BASE_URL}${APP_URL}/company/${companyId}/${applicationId}`,
      data: applicationData,
      headers: {
        'user-type': 'agency',
        Authorization: jwtToken
      }
    })

    dispatch({
      type: EDIT_APPLICATION,
      payload: res.data
    })

    dispatch(stopLoadingApplication())
  } catch (err) {
    dispatch(stopLoadingApplication())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const deleteApplication = (
  companyId,
  applicationId
) => async dispatch => {
  dispatch(loadingApplication())

  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken')
    const res = await axios({
      method: 'delete',
      url: `${BASE_URL}${APP_URL}/company/${companyId}/${applicationId}`,
      headers: {
        'user-type': 'agency',
        Authorization: jwtToken
      }
    })

    dispatch({
      type: DELETE_APPLICATION,
      payload: res.data
    })

    dispatch(stopLoadingApplication())
  } catch (err) {
    dispatch(stopLoadingApplication())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}
