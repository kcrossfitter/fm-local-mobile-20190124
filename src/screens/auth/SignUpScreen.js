import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import { Button, Text } from 'react-native-paper'
import { Formik } from 'formik'
import * as yup from 'yup'

import StyledInput from '../../components/form/StyledInput'
import StyledDropdown from '../../components/form/StyledDropdown'
import isEmpty from '../../validation/isEmpty'
import { registerUser } from '../../actions/authActions'
import { getLocalDepts } from '../../actions/localDeptActions'

const validationSchema = yup.object().shape({
  localDept: yup
    .string()
    .label('농업기술센터명')
    .test('localDept', '농업기술센터명은 필수입니다', function(value) {
      // if (value === undefined) value = '0'
      return value !== undefined
    }),
  name: yup
    .string()
    .label('이름')
    .required('이름은 필수입니다')
    .min(2, '이름은 최소 2자입니다')
    .max(8, '이름은 최대 8자입니다'),
  email: yup
    .string()
    // .label('이메일')
    .email('잘못된 이메일입니다')
    .required('이메일은 필수입니다'),
  phone: yup
    .string()
    .required('이동전화번호는 필수입니다')
    .test('phone-match', '잘못된 전화번호입니다', function(value) {
      const isMatch = /^(010-)\d{4}-\d{4}$/.test(value)
      return isMatch
    }),
  password: yup
    .string()
    // .label('패스워드')
    .required('패스워드는 필수입니다')
    .min(6, '패스워드는 최소 6자리입니다')
    .max(12, '패스워드는 최대 12자리입니다'),
  confirmPassword: yup
    .string()
    // .label('Confirm Password')
    .required('확인 패스워드는 필수입니다')
    .test('passwords-match', '패스워드가 일치하지 않습니다', function(value) {
      return this.parent.password === value
    })
})

class SignUpScreen extends Component {
  static navigationOptions = {
    title: '서비스에 가입하세요'
  }

  state = {
    registerErrors: {}
  }

  componentDidMount = () => {
    if (!this.props.localDepts) {
      this.props.getLocalDepts()
    }
  }

  componentWillReceiveProps = nextProps => {
    console.log(nextProps.errors)
    if (!isEmpty(nextProps.errors)) {
      this.setState({ registerErrors: nextProps.errors })
    }
  }

  _showErrors = () => {
    const {
      registerErrors: { email, register }
    } = this.state

    if (email) {
      return <Text style={styles.errorText}>{email}</Text>
    } else if (register) {
      return <Text style={styles.errorText}>{register}</Text>
    } else {
      return null
    }
  }

  render() {
    const { navigate } = this.props.navigation
    const { registerUser } = this.props
    const { localDepts, localLoading } = this.props

    if (localLoading === true || localDepts === null) {
      return <ActivityIndicator size="large" color="red" />
    }

    let options = []

    localDepts.forEach(local => {
      let sido = local.localDeptAddress.split(/\s+/)[0]
      options.push({
        label: `${local.localDeptName} (${sido})`,
        value: local._id
      })
    })

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
        <ScrollView style={{ paddingBottom: 20 }}>
          <View style={{ flex: 4 }}>
            <Formik
              initialValues={{
                name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
              }}
              onSubmit={(
                { localDept, name, email, phone, password },
                actions
              ) => {
                registerUser(
                  { localDept, name, email, phone, password },
                  navigate
                )
              }}
              validationSchema={validationSchema}
            >
              {formikProps => (
                <React.Fragment>
                  <StyledDropdown
                    label="재직 중인 농업기술센터를 선택하세요"
                    formikProps={formikProps}
                    formikKey="localDept"
                    data={options}
                    itemCount={6}
                  />
                  <StyledInput
                    label="Name"
                    inline={false}
                    formikProps={formikProps}
                    formikKey="name"
                    placeholder="이름을 입력하세요"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <StyledInput
                    label="Email"
                    inline={false}
                    formikProps={formikProps}
                    formikKey="email"
                    placeholder="johndoe@example.com"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <StyledInput
                    label="Mobile Phone"
                    inline={false}
                    formikProps={formikProps}
                    formikKey="phone"
                    placeholder="010-0000-0000"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <StyledInput
                    label="Password"
                    inline={false}
                    formikProps={formikProps}
                    formikKey="password"
                    placeholder="Enter password"
                    secureTextEntry
                  />
                  <StyledInput
                    label="Confirm Password"
                    inline={false}
                    formikProps={formikProps}
                    formikKey="confirmPassword"
                    placeholder="Enter password again"
                    secureTextEntry
                  />

                  {this._showErrors()}

                  <View style={{ marginTop: 10 }}>
                    <Button
                      mode="contained"
                      onPress={formikProps.handleSubmit}
                      style={styles.signUpBtn}
                      loading={this.props.authenticating}
                    >
                      <Text style={styles.signUpBtnText}>신규 등록</Text>
                    </Button>

                    <Button
                      mode="text"
                      onPress={() => this.props.navigation.navigate('SignIn')}
                      style={{ marginTop: 15 }}
                    >
                      <Text style={styles.loginBtnText}>
                        회원이신가요? 로그인하세요!
                      </Text>
                    </Button>
                  </View>
                </React.Fragment>
              )}
            </Formik>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  signUpBtn: {
    backgroundColor: '#4253AF',
    marginHorizontal: 20,
    paddingVertical: 5
  },
  signUpBtnText: {
    color: 'white',
    fontSize: 24
  },
  loginBtnText: {
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
  errors: state.errors,
  localDepts: state.local.localDepts,
  localLoading: state.local.loading
})

const mapDispatchToProps = dispatch => ({
  registerUser: (userData, navigate) =>
    dispatch(registerUser(userData, navigate)),
  getLocalDepts: () => dispatch(getLocalDepts())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpScreen)
