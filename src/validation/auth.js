import validator from 'validator'

import isEmpty from './isEmpty'
import {
  MIN_PASSWORD_LEN,
  MAX_PASSWORD_LEN,
  MIN_NAME_LEN,
  MAX_NAME_LEN,
  MIN_ADDRESS_LEN,
  MAX_ADDRESS_LEN,
  POSTAL_NO_LEN
} from './constants'

// Email 검증 (Email 형태)
export const isEmail = value => {
  isEmpty(value) && (value = '')

  if (validator.isEmpty(value)) {
    return '이메일은 필수입니다'
  }

  return validator.isEmail(value) ? undefined : '잘못된 이메일입니다'
}

// 비밀번호 검증 (비밀번호 길이)
export const isPassword = value => {
  isEmpty(value) && (value = '')

  if (validator.isEmpty(value)) {
    return '비밀번호는 필수입니다'
  }

  if (
    !validator.isLength(value, {
      min: MIN_PASSWORD_LEN,
      max: MAX_PASSWORD_LEN
    })
  ) {
    return `비밀번호는 최소 ${MIN_PASSWORD_LEN} 최대 ${MAX_PASSWORD_LEN}입니다`
  }

  return undefined
}

export const passwordsMatch = (pwd1, pwd2) => pwd1 === pwd2

// 이름 검증 (이름 길이)
export const isName = value => {
  isEmpty(value) && (value = '')

  if (validator.isEmpty(value)) {
    return '이름은 필수 입력 사항입니다'
  }

  if (
    !validator.isLength(value, {
      min: MIN_NAME_LEN,
      max: MAX_NAME_LEN
    })
  ) {
    return `이름은 최소 ${MIN_NAME_LEN} 최대 ${MAX_NAME_LEN}입니다`
  }

  return undefined
}

// 휴대전화 검증 (휴대전화번호 형태)
export const isMobilePhone = value => {
  isEmpty(value) && (value = '')

  if (validator.isEmpty(value)) {
    return '휴대전화번호는 필수 입력 사항입니다'
  }
  return validator.isMobilePhone(value, 'ko-KR')
    ? undefined
    : '잘못된 휴대폰 번호입니다'
}

// 우편번호 검증 (5자리 숫자인지만 검증)
export const isPostalCode = value => {
  isEmpty(value) && (value = '')

  if (validator.isEmpty(value)) {
    return '우편번호는 필수 입력 사항입니다'
  }
  if (value.length !== POSTAL_NO_LEN) {
    return '우편번호 길이는 5여야 합니다'
  }
  if (!/^\d+$/.test(value)) {
    return '우퍈번호는 숫자여야 합니다'
  }
  return undefined
}

// 주소 검증 (주소 길이)
export const isAddress = value => {
  isEmpty(value) && (value = '')

  if (validator.isEmpty(value)) {
    return '주소는 필수 입력 사항입니다'
  }

  if (
    !validator.isLength(value, {
      min: MIN_ADDRESS_LEN,
      max: MAX_ADDRESS_LEN
    })
  ) {
    return `주소는 최소 ${MIN_ADDRESS_LEN} 최대 ${MAX_ADDRESS_LEN}입니다`
  }

  return undefined
}

// 회사 이름 검증 (회사 이름 길이)
export const isCompany = value => {
  isEmpty(value) && (value = '')

  if (validator.isEmpty(value) || value === '0') {
    return '회사이름은 필수입니다'
  }

  if (
    !validator.isLength(value, {
      min: MIN_COMPANY_LEN,
      max: MAX_COMPANY_LEN
    })
  ) {
    return `회사이름 길이는 최소 ${MIN_COMPANY_LEN} 최대 ${MAX_COMPANY_LEN}입니다`
  }

  return undefined
}
