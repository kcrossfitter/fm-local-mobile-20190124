import React from 'react'
// import { TextInput } from 'react-native'
import { TextInput } from 'react-native-paper'

import FieldWrapper from './FieldWrapper'

const StyledInput = ({
  label,
  outlined,
  inline,
  formikProps,
  formikKey,
  ...rest
}) => {
  // const inputStyles = {
  //   borderColor: '#888',
  //   borderWidth: 1,
  //   borderRadius: 5,
  //   padding: 10,
  //   fontSize: 16,
  //   marginBottom: 3
  // }
  let error

  if (formikProps.touched[formikKey] && formikProps.errors[formikKey]) {
    error = true
    // inputStyles.borderColor = 'red'
  }

  return (
    <FieldWrapper
      // label={label}
      inline={inline}
      formikProps={formikProps}
      formikKey={formikKey}
    >
      <TextInput
        // style={inputStyles}
        label={label}
        outlined={outlined}
        error={error}
        value={formikProps.values[formikKey]}
        onChangeText={formikProps.handleChange(formikKey)}
        onBlur={formikProps.handleBlur(formikKey)}
        {...rest}
      />
    </FieldWrapper>
  )
}

export default StyledInput
