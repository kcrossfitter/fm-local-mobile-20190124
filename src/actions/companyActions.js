/**
 *  'admin'만 회사 정보에 대해 액세스 할 수 있음
 *  단, 사용자가 agency일 경우 register할 때 전체 리스트를 액세스 할 수 있음
 *  회사 등록 절차
 *    - 오프라인으로 서류 제출 (확인 후 시스템에 등록)
 *    - 회사 정보 수정이 필요할 경우에도 'admin'에게 요청을 해야 함
 */
import axios from 'axios'

import {
  GET_COMPANIES,
  GET_COMPANY,
  ADD_COMPANY,
  MODIFY_COMPANY,
  DELETE_COMPANY,
  LOADING_COMPANY,
  LOADING_COMPANY_END
} from './types'
import handleActionError from './handleActionError'
import { getErrors, clearErrors } from './errorActions'
import { BASE_URL } from '../config'

const COMPANY_URL = '/api/forage-companies'

export const loadingCompany = () => ({
  type: LOADING_COMPANY
})

export const stopLoadingCompany = () => ({
  type: LOADING_COMPANY_END
})

// 시스템에 등록된 모든 회사의 정보를 fetch
export const getCompanies = () => async dispatch => {
  dispatch(loadingCompany())

  try {
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}${COMPANY_URL}`,
      headers: {
        'user-type': 'agency'
      }
    })

    dispatch({
      type: GET_COMPANIES,
      payload: res.data
    })

    dispatch(stopLoadingCompany())
  } catch (err) {
    dispatch(stopLoadingCompany())

    dispatch(getErrors(handleActionError(err)))
  }
}

// 시스템에 등록된 특정 회사의 정보를 fetch
export const getCompany = companyId => async dispatch => {
  dispatch(loadingCompany())

  try {
    const res = await axios({
      method: 'get',
      url: `${BASE_URL}/${companyId}`,
      headers: {
        'user-type': 'agency'
      }
    })

    dispatch({
      type: GET_COMPANY,
      payload: res.data
    })

    dispatch(stopLoadingCompany())
  } catch (err) {
    dispatch(stopLoadingCompany())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

// 새로운 회사를 시스템에 등록
export const addCompany = (companyData, history) => async dispatch => {
  dispatch(loadingCompany())

  try {
    const res = await axios({
      method: 'post',
      url: `${BASE_URL}`,
      data: companyData,
      headers: {
        'user-type': 'agency'
      }
    })

    dispatch({
      type: ADD_COMPANY,
      payload: res.data
    })

    dispatch(stopLoadingCompany())

    history.push('/companies')
  } catch (err) {
    dispatch(stopLoadingCompany())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const modifyCompany = (
  companyData,
  companyId,
  history
) => async dispatch => {
  dispatch(loadingCompany())

  try {
    const res = await axios({
      method: 'put',
      url: `${BASE_URL}/${companyId}`,
      data: companyData,
      headers: {
        'user-type': 'agency'
      }
    })

    dispatch({
      type: MODIFY_COMPANY,
      payload: res.data
    })

    dispatch(stopLoadingCompany())

    history.push('/companies')
  } catch (err) {
    dispatch(stopLoadingCompany())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}

export const deleteCompany = companyId => async dispatch => {
  dispatch(loadingCompany())

  try {
    const res = await axios({
      method: 'delete',
      url: `${BASE_URL}/${companyId}`,
      headers: {
        'user-type': 'agency'
      }
    })

    dispatch({
      type: DELETE_COMPANY,
      payload: res.data
    })

    dispatch(stopLoadingCompany())
  } catch (err) {
    dispatch(stopLoadingCompany())

    dispatch({
      type: GET_ERRORS,
      payload: handleActionError(err)
    })
  }
}
