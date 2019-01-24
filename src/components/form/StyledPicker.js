import React from 'react'
import { View } from 'react-native'
import { Picker, Text } from 'native-base'

const StyledPicker = ({ formikProps, formikKey, options, ...rest }) => {
  return (
    <View>
      <View
        style={{
          marginHorizontal: 20,
          marginVertical: 5,
          backgroundColor: 'rgba(239,239,239,0.5)',
          borderColor: '#888',
          borderWidth: 1,
          borderRadius: 5
        }}
      >
        <Picker
          selectedValue={formikProps.values[formikKey]}
          onValueChange={(itemValue, itemIndex) => {
            formikProps.setFieldValue(formikKey, itemValue)
          }}
          {...rest}
        >
          {options.map(option => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
      </View>
      <Text style={{ color: 'red', fontSize: 14 }}>
        {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
      </Text>
    </View>
  )
}

export default StyledPicker
