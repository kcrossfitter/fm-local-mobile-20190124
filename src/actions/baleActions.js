import axios from 'axios'
import { AsyncStorage } from 'react-native'

import {
  GET_BALES_LOCAL,
  GET_BALES_LOCAL_FARMER,
  GET_BALES_LOCAL_FARMER_PILJI,
  GET_BALE_LOCAL_FARMER_PILJI,
  GET_BALES_LOCAL_COMPANY,
  GET_BALES_LOCAL_COMPANY_PILJI,
  GET_BALE_LOCAL_COMPANY_PILJI,
  LOADING_BALE,
  LOADING_BALE_END,
  GET_ERRORS
} from './types'
import handleActionError from './handleActionError'
import { BASE_URL } from '../config'

const BALE_URL = '/api/bales'

// Loading Indicator
const loadingBale = () => ({
  type: LOADING_BALE
})

const stopLoadingBale = () => ({
  type: LOADING_BALE_END
})

export const getBalesLocal = localId => async dispatch => {
  dispatch(loadingBale())

  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken')
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}${BALE_URL}/local/${localId}`,
      headers: {
        'user-type': 'local',
        Authorization: jwtToken
      }
    })

    dispatch({
      type: GET_BALES_LOCAL,
      payload: res.data
    })

    dispatch(stopLoadingBale())
  } catch (err) {
    dispatch(stopLoadingBale())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

// 당해년도 특정 농부 소유의 필지에서 생산된 곤포를 필지별로 요약 정보를 보여주는 역할
export const getBalesLocalFarmer = (localId, farmerId) => async dispatch => {
  dispatch(loadingBale())

  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken')
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}${BALE_URL}/local/farmer/${localId}/${farmerId}`,
      headers: {
        'user-type': 'local',
        Authorization: jwtToken
      }
    })

    dispatch({
      type: GET_BALES_LOCAL_FARMER,
      payload: res.data
    })

    dispatch(stopLoadingBale())
  } catch (err) {
    dispatch(stopLoadingBale())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const getBalesLocalFarmerPilji = (
  localId,
  farmerId,
  piljiId
) => async dispatch => {
  dispatch(loadingBale())

  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken')
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}${BALE_URL}/local/farmer/${localId}/${farmerId}/${piljiId}`,
      headers: {
        'user-type': 'local',
        Authorization: jwtToken
      }
    })

    // console.log('res', res.data)

    dispatch({
      type: GET_BALES_LOCAL_FARMER_PILJI,
      payload: res.data
    })

    dispatch(stopLoadingBale())
  } catch (err) {
    dispatch(stopLoadingBale())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const getBaleLocalFarmerPilji = (localId, baleId) => async dispatch => {
  dispatch(loadingBale())

  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken')
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}${BALE_URL}/local/farmer/${localId}/bale/${baleId}`,
      headers: {
        'user-type': 'local',
        Authorization: jwtToken
      }
    })

    // console.log('res', res.data)

    dispatch({
      type: GET_BALE_LOCAL_FARMER_PILJI,
      payload: res.data
    })

    dispatch(stopLoadingBale())
  } catch (err) {
    dispatch(stopLoadingBale())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const getBalesLocalCompany = (localId, companyId) => async dispatch => {
  dispatch(loadingBale())

  console.log('localId', localId)
  console.log('companyId', companyId)

  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken')
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}${BALE_URL}/local/company/${localId}/${companyId}`,
      headers: {
        'user-type': 'local',
        Authorization: jwtToken
      }
    })

    // console.log('res =>', res.data)

    dispatch({
      type: GET_BALES_LOCAL_COMPANY,
      payload: res.data
    })

    dispatch(stopLoadingBale())
  } catch (err) {
    dispatch(stopLoadingBale())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const getBalesLocalCompanyPilji = (
  localId,
  companyId,
  piljiId
) => async dispatch => {
  dispatch(loadingBale())

  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken')
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}${BALE_URL}/local/company/${localId}/${companyId}/${piljiId}`,
      headers: {
        'user-type': 'local',
        Authorization: jwtToken
      }
    })

    // console.log('res', res.data)

    dispatch({
      type: GET_BALES_LOCAL_COMPANY_PILJI,
      payload: res.data
    })

    dispatch(stopLoadingBale())
  } catch (err) {
    dispatch(stopLoadingBale())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const getBaleLocalCompanyPilji = (localId, baleId) => async dispatch => {
  dispatch(loadingBale())

  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken')
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}${BALE_URL}/local/company/${localId}/bale/${baleId}`,
      headers: {
        'user-type': 'local',
        Authorization: jwtToken
      }
    })

    // console.log('res', res.data)

    dispatch({
      type: GET_BALE_LOCAL_COMPANY_PILJI,
      payload: res.data
    })

    dispatch(stopLoadingBale())
  } catch (err) {
    dispatch(stopLoadingBale())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}
