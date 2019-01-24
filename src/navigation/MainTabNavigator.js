import React from 'react'
import { Platform } from 'react-native'
import {
  createStackNavigator,
  createBottomTabNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'

import DashboardMainScreen from '../screens/dashboard/DashboardMainScreen'

import ApplicationMainScreen from '../screens/application/ApplicationMainScreen'
import ApplicationProcessScreen from '../screens/application/ApplicationProcessScreen'
import ApplicationsPerFarmerScreen from '../screens/application/ApplicationsPerFarmerScreen'
import ApplicationDetailScreen from '../screens/application/ApplicationDetailScreen'

import BaleMainScreen from '../screens/bale/BaleMainScreen'
import BalesPerFarmerScreen from '../screens/bale/BalesPerFarmerScreen'
import BalesPerPiljiScreen from '../screens/bale/BalesPerPiljiScreen'
import BalesPerCompanyScreen from '../screens/bale/BalesPerCompanyScreen'
import BalesMapScreen from '../screens/bale/BalesMapScreen'

import ProfileMainScreen from '../screens/profile/ProfileMainScreen'
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen'

const DashboardStack = createStackNavigator(
  {
    DashboardMain: {
      screen: DashboardMainScreen,
      navigationOptions: ({ navigation }) => ({
        title: 'Dashboard'
      })
    }
  },
  {
    navigationOptions: {
      tabBarLabel: '대시보드',
      tabBarIcon: <FontAwesome size={20} name="list-alt" />
    }
  }
)

const ApplicationStack = createStackNavigator(
  {
    ApplicationMain: {
      screen: ApplicationMainScreen,
      navigationOptions: ({ navigation }) => ({
        title: '파종 신청 관리'
      })
    },
    ApplicationProcess: {
      screen: ApplicationProcessScreen,
      navigationOptions: ({ navigation }) => ({
        title: '파종 신청 처리'
      })
    },
    ApplicationsPerFarmer: {
      screen: ApplicationsPerFarmerScreen,
      navigationOptions: ({ navigation }) => ({
        title: '농민별 현황'
      })
    },
    ApplicationDetail: {
      screen: ApplicationDetailScreen,
      navigationOptions: ({ navigation }) => ({
        title: '파종신청 상세'
      })
    }
  },
  {
    navigationOptions: {
      tabBarLabel: '파종신청',
      tabBarIcon: <FontAwesome size={20} name="cogs" />
    }
  }
)

const BaleStack = createStackNavigator(
  {
    BaleMain: {
      screen: BaleMainScreen,
      navigationOptions: ({ navigation }) => ({
        title: '수확 현황 - 전체'
      })
    },
    BalesPerFarmer: {
      screen: BalesPerFarmerScreen,
      navigationOptions: ({ navigation }) => ({
        title: '수확 현황 - 농민별'
      })
    },
    BalesPerPilji: {
      screen: BalesPerPiljiScreen,
      navigationOptions: ({ navigation }) => ({
        title: '수확 현황 - 필지별'
      })
    },
    BalesPerCompany: {
      screen: BalesPerCompanyScreen,
      navigationOptions: ({ navigation }) => ({
        title: '수확 현황 - 수확단별'
      })
    },
    BalesMap: {
      screen: BalesMapScreen,
      navigationOptions: ({ navigation }) => ({
        title: '수확 현황 - 위치'
      })
    }
  },
  {
    navigationOptions: {
      tabBarLabel: '수확 현황',
      tabBarIcon: <MaterialCommunityIcons size={20} name="cow" />
    }
  }
)

const ProfileStack = createStackNavigator(
  {
    ProfileMain: {
      screen: ProfileMainScreen,
      navigationOptions: ({ navigation }) => ({
        title: '프로파일 관리'
      })
    },
    ChangePassword: {
      screen: ChangePasswordScreen,
      navigationOptions: ({ navigation }) => ({
        title: '패스워드 변경'
      })
    }
  },
  {
    navigationOptions: {
      tabBarLabel: '프로파일',
      tabBarIcon: <FontAwesome size={20} name="user" />
    }
  }
)

export default createBottomTabNavigator(
  {
    Dashboard: DashboardStack,
    Application: ApplicationStack,
    Bale: BaleStack,
    Profile: ProfileStack
  },
  {
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray'
    }
  }
)
