import axios from 'axios'

import {
  GET_LOCALDEPTS,
  GET_LOCALDEPT,
  LOADING_LOCALDEPT,
  LOADING_LOCALDEPT_END,
  GET_ERRORS
} from './types'
import handleActionError from './handleActionError'
import { BASE_URL } from '../config'

const LOCALDEPT_URL = '/api/localdepts'

export const loadingLocalDept = () => ({
  type: LOADING_LOCALDEPT
})

export const stopLoadingLocalDept = () => ({
  type: LOADING_LOCALDEPT_END
})

export const getLocalDepts = () => async dispatch => {
  dispatch(loadingLocalDept())

  try {
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}${LOCALDEPT_URL}`,
      headers: {
        'user-type': 'local'
      }
    })

    console.log('res.data =>', res.data)

    dispatch({
      type: GET_LOCALDEPTS,
      payload: res.data
    })

    dispatch(stopLoadingLocalDept())
  } catch (err) {
    dispatch(stopLoadingLocalDept())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const getLocalDept = localDeptId => async dispatch => {
  dispatch(loadingLocalDept())

  try {
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}${LOCALDEPT_URL}/${localDeptId}`,
      headers: {
        'user-type': 'local'
      }
    })

    dispatch({
      type: GET_LOCALDEPT,
      payload: res.data
    })

    dispatch(stopLoadingLocalDept())
  } catch (err) {
    dispatch(stopLoadingLocalDept())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}
