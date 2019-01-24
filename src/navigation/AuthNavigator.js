import { createStackNavigator } from 'react-navigation'

import SignInScreen from '../screens/auth/SignInScreen'
import SignUpScreen from '../screens/auth/SignUpScreen'

const AuthNavigator = createStackNavigator({
  SignIn: SignInScreen,
  SignUp: SignUpScreen
})

export default AuthNavigator
