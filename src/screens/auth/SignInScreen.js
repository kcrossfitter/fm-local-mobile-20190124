import React, { Component } from 'react'
import { connect } from 'react-redux'
import { KeyboardAvoidingView, View, StyleSheet, Image } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { Formik } from 'formik'
import * as yup from 'yup'

import StyledInput from '../../components/form/StyledInput'
import { loginUser } from '../../actions/authActions'
import isEmpty from '../../validation/isEmpty'

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('잘못된 이메일입니다')
    .required('이메일은 필수입니다'),
  password: yup
    .string()
    .required('패스워드는 필수입니다')
    .min(6, '패스워드가 짦습니다...')
    .max(12, '패스워드가 깁니다...')
})

class SignInScreen extends Component {
  state = {
    loginErrors: {}
  }

  static navigationOptions = {
    title: '로그인 하세요',
    headerBackTitle: '로그인'
  }

  componentWillReceiveProps = nextProps => {
    console.log(nextProps.errors)
    if (!isEmpty(nextProps.errors)) {
      this.setState({ loginErrors: nextProps.errors })
    }
  }

  _showErrors = () => {
    const {
      loginErrors: { email, password, right, login }
    } = this.state

    if (email) {
      return <Text style={styles.errorText}>{email}</Text>
    } else if (password) {
      return <Text style={styles.errorText}>{password}</Text>
    } else if (right) {
      return <Text style={styles.errorText}>{right}</Text>
    } else if (login) {
      return <Text style={styles.errorText}>{login}</Text>
    } else {
      return null
    }
  }

  render() {
    const { navigate } = this.props.navigation
    const { loginUser } = this.props

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logoImg}
            source={require('../../../assets/images/atoa-logo.png')}
          />
        </View>
        <View style={{ flex: 4 }}>
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            onSubmit={({ email, password }, actions) => {
              loginUser({ email, password }, navigate)
            }}
            validationSchema={validationSchema}
          >
            {formikProps => (
              <React.Fragment>
                <StyledInput
                  label="Email"
                  inline={false}
                  formikProps={formikProps}
                  formikKey="email"
                  placeholder="johndoe@example.com"
                  autoCapitalize="none"
                />
                <StyledInput
                  label="Password"
                  inline={false}
                  formikProps={formikProps}
                  formikKey="password"
                  placeholder="Enter password"
                  secureTextEntry
                />
                {this._showErrors()}
                <View style={styles.btnContainer}>
                  <Button
                    mode="contained"
                    onPress={formikProps.handleSubmit}
                    style={styles.loginBtn}
                    loading={this.props.authenticating}
                  >
                    <Text style={styles.loginBtnText}>로그인</Text>
                  </Button>

                  <Button
                    mode="text"
                    onPress={() => this.props.navigation.navigate('SignUp')}
                    style={{ marginTop: 15 }}
                  >
                    <Text style={styles.signUpBtn}>
                      회원이 아니신가요? 등록하세요!
                    </Text>
                  </Button>
                </View>
              </React.Fragment>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  logoContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 20
  },
  logoImg: {
    width: 125,
    height: 125
  },
  btnContainer: {
    marginTop: 10
  },
  loginBtn: {
    backgroundColor: '#4253AF',
    marginHorizontal: 20,
    paddingVertical: 5
  },
  loginBtnText: {
    color: 'white',
    fontSize: 24
  },
  signUpBtn: {
    fontSize: 14,
    textDecorationLine: 'underline',
    color: '#4253AF'
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
    color: 'red'
  }
})

const mapStateToProps = state => ({
  authenticating: state.auth.authenticating,
  errors: state.errors
})

const mapDispatchToProps = dispatch => ({
  loginUser: (loginData, navigate) => dispatch(loginUser(loginData, navigate))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInScreen)
