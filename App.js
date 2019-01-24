import React, { Component } from 'react'
import { Provider } from 'react-redux'
import {
  AsyncStorage,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { AppLoading, Asset, Font } from 'expo'
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons
} from '@expo/vector-icons'
import AppNavigator from './src/navigation/AppNavigator'

import store from './src/store'

class App extends Component {
  state = { isLoadingComplete: false }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/tractor.png'),
        require('./assets/images/atoa-logo.png')
      ]),
      Font.loadAsync({
        ...Ionicons.font,
        ...MaterialIcons.font,
        ...MaterialCommunityIcons.font
      })
    ])
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error)
  }

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true })
  }

  _clearStorage = async () => {
    await AsyncStorage.clear()
  }

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      )
    } else {
      this._clearStorage()

      // return (
      //   <Provider store={store}>
      //     <View style={styles.container}>
      //       {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
      //       <AppNavigator />
      //     </View>
      //   </Provider>
      // )
      return (
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default App
