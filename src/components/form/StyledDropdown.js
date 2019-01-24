import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown'
// import { Picker, Text } from 'native-base'

class StyledDropdown extends Component {
  render() {
    const { label, data, formikProps, formikKey, ...rest } = this.props
    let error

    if (formikProps.touched[formikKey] && formikProps.errors[formikKey]) {
      error = true
    }

    return (
      <View>
        <View style={{ marginHorizontal: 20 }}>
          <Dropdown
            label={label}
            data={data}
            error={formikProps.errors[formikKey]}
            labelExtractor={item => item.label}
            valueExtractor={item => item.value}
            value={formikProps.values[formikKey]}
            onChangeText={formikProps.handleChange(formikKey)}
            {...rest}
          />
        </View>
        {/* <Text style={{ color: 'red', fontSize: 14 }}>
          {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
        </Text> */}
      </View>
    )
  }
}

export default StyledDropdown
