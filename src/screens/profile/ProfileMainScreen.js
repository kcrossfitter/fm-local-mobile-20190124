import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TouchableOpacity, TouchableHighlight, Text, View } from 'react-native'

// import { Container, Content, H3, Text, Button } from 'native-base'
import { logoutUser, changePassword } from '../../actions/authActions'

class ProfileMainScreen extends Component {
  _logout = () => {
    this.props.logoutUser()
    this.props.navigation.navigate('SignIn')
  }

  static navigationOptions = {
    title: '프로파일 관리'
  }

  render() {
    const { navigate } = this.props.navigation

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ marginBottom: 20 }}>
          <TouchableHighlight onPress={() => navigate('ChangePassword')}>
            <Text
              style={{
                fontSize: 15,
                textAlign: 'center',
                textDecorationLine: 'underline',
                color: '#4286f4'
              }}
            >
              It's good to change password frequently, huh?
            </Text>
          </TouchableHighlight>
        </View>
        <View style={{ marginBottom: 20 }}>
          <TouchableHighlight onPress={this._logout}>
            <Text
              style={{
                fontSize: 15,
                textAlign: 'center',
                textDecorationLine: 'underline',
                color: '#4286f4'
              }}
            >
              You don't need to logout, but just in case!
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  // render() {
  //   return (
  //     <Container>
  //       <Content
  //         padder
  //         contentContainerStyle={{
  //           flex: 1,
  //           alignItems: 'center',
  //           justifyContent: 'center'
  //         }}
  //       >
  //         <H3>Profile Main Screen</H3>
  //         <Button block rounded warning onPress={this._logout}>
  //           <Text style={{ fontWeight: '500' }}>로그아웃</Text>
  //         </Button>
  //       </Content>
  //     </Container>
  //   )
  // }
}

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser()),
  changePassword: (userData, navigate) =>
    dispatch(changePassword(userData, navigate))
})

export default connect(
  null,
  mapDispatchToProps
)(ProfileMainScreen)
