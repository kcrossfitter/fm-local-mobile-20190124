import React, { Component } from 'react'
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'

import AuthNavigator from './AuthNavigator'
import MainTabNavigator from './MainTabNavigator'

class AuthLoadingScreen extends Component {
  constructor(props) {
    super(props)
    this._bootstrapAsync()
  }

  // react native의 AsyncStorage에서 jwtToken value를 읽어옴
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('jwtToken')

    console.log('userToken', userToken)

    // userToken 값이 없으면 인증된 상태가 아니므로 Auth(AuthNavigator)로,
    // userToken 값이 있으면 Main(MainTabNavigator)로 이동
    // AuthLoading은 switchNavigator내에 있으므로 Main이나 Auth로 스위치 된 후에는
    // 액세스 불가
    this.props.navigation.navigate(userToken ? 'Main' : 'Auth')
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    )
  }
}

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Main: MainTabNavigator,
      Auth: AuthNavigator
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
)
