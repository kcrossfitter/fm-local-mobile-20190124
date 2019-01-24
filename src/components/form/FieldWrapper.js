import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const FieldWrapper = ({ children, label, inline, formikProps, formikKey }) => (
  <View style={inline ? styles.inline : styles.block}>
    {/* {label && <Text style={{ marginBottom: 3 }}>{label}</Text>} */}
    {children}
    <Text style={{ color: 'red', fontSize: 12 }}>
      {formikProps.touched[formikKey] && formikProps.errors[formikKey]}
    </Text>
  </View>
)

const styles = StyleSheet.create({
  inline: {
    marginLeft: 10,
    marginRight: 20
  },
  block: {
    marginHorizontal: 20,
    marginVertical: 5
  }
})

export default FieldWrapper
