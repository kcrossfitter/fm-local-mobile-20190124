import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  View
} from 'react-native'
import { Formik } from 'formik'
import * as yup from 'yup'

import StyledInput from '../../components/form/StyledInput'
import { changePassword } from '../../actions/authActions'
import isEmpty from '../../validation/isEmpty'

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .required('현재 패스워드는 반드시 입력해야 합니다')
    .min(6, '패스워드가 짦습니다...')
    .max(12, '패스워드가 깁니다...'),
  newPassword1: yup
    .string()
    .required('패스워드는 필수입니다')
    .min(6, '패스워드가 짦습니다...')
    .max(12, '패스워드가 깁니다...'),
  newPassword2: yup
    .string()
    .required('확인 패스워드는 필수입니다')
    .min(6, '패스워드가 짦습니다...')
    .max(12, '패스워드가 깁니다...')
    .test('passwords-match', '패스워드가 일치하지 않습니다', function(value) {
      return this.parent.newPassword1 === value
    })
})

class ChangePasswordScreen extends Component {
  state = {
    changePasswordErrors: {}
  }

  componentWillReceiveProps = nextProps => {
    console.log(nextProps.errors)
    if (!isEmpty(nextProps.errors)) {
      this.setState({ changePasswordErrors: nextProps.errors })
    }
  }

  _showErrors = () => {
    const {
      changePasswordErrors: { originalPassword, changePassword }
    } = this.state

    if (originalPassword) {
      return <Text style={styles.errorText}>{originalPassword}</Text>
    } else if (changePassword) {
      return <Text style={styles.errorText}>{changePassword}</Text>
    } else {
      return null
    }
  }

  render() {
    const { navigate } = this.props.navigation
    const { changePassword } = this.props

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Formik
            initialValues={{
              password: '',
              newPassword1: '',
              newPassword2: ''
            }}
            onSubmit={({ password, newPassword1, newPassword2 }, actions) => {
              changePassword({ password, newPassword1 }, navigate)
            }}
            validationSchema={validationSchema}
          >
            {formikProps => (
              <React.Fragment>
                <StyledInput
                  label="Original Password"
                  formikProps={formikProps}
                  formikKey="password"
                  placeholder="현재 패스워드를 입력하세요"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <StyledInput
                  label="New Password"
                  formikProps={formikProps}
                  formikKey="newPassword1"
                  placeholder="Enter password"
                  secureTextEntry
                />
                <StyledInput
                  label="Confirm New Password"
                  formikProps={formikProps}
                  formikKey="newPassword2"
                  placeholder="Enter password again"
                  secureTextEntry
                />
                {this._showErrors()}
                {this.props.auth.authenticating ? (
                  <ActivityIndicator />
                ) : (
                  <React.Fragment>
                    <View
                      style={{
                        height: 50,
                        backgroundColor: '#4286f4',
                        marginHorizontal: 20,
                        borderRadius: 5,
                        justifyContent: 'center'
                      }}
                    >
                      <TouchableOpacity onPress={formikProps.handleSubmit}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: 'white',
                            fontSize: 24,
                            fontWeight: '400'
                          }}
                        >
                          패스워드 변경
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableHighlight
                      onPress={() => this.props.navigation.goBack()}
                      style={{ marginTop: 5 }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          textAlign: 'center',
                          textDecorationLine: 'underline',
                          color: '#4286f4'
                        }}
                      >
                        비밀번호 변경 취소!
                      </Text>
                    </TouchableHighlight>
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </Formik>
        </View>
      </KeyboardAvoidingView>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
})

const mapDispatchToProps = dispatch => ({
  changePassword: (userData, navigate) =>
    dispatch(changePassword(userData, navigate))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePasswordScreen)
