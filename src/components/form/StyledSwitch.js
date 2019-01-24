import React from 'react'
import { Switch } from 'react-native'

import FieldWrapper from './FieldWrapper'

const StyledSwitch = ({ label, formikKey, formikProps, ...rest }) => {
  return (
    <FieldWrapper label={label} formikProps={formikProps} formikKey={formikKey}>
      <Switch
        value={formikProps.values[formikKey]}
        onValueChange={value => {
          formikProps.setFieldValue(formikKey, value)
        }}
        {...rest}
      />
    </FieldWrapper>
  )
}

export default StyledSwitch
