import React from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'

const Spinner = ({ size, color }) => (
  <View style={styles.centerLoading}>
    <ActivityIndicator size={size} color={color} />
  </View>
)

const styles = StyleSheet.create({
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Spinner
