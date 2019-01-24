import React from 'react'
import { connect } from 'react-redux'
import {
  ActivityIndicator,
  AsyncStorage,
  ScrollView,
  StyleSheet,
  View
} from 'react-native'
import { Button, List, Text } from 'react-native-paper'
import _ from 'lodash'
import jwt_decode from 'jwt-decode'

import { getAppsLocal } from '../../actions/applicationActions'
import { getBalesLocal } from '../../actions/baleActions'

class DashboardMainScreen extends React.Component {
  componentDidMount = async () => {
    const jwtToken = await AsyncStorage.getItem('jwtToken')

    if (!jwtToken) {
      return this.props.navigation.navigate('SignIn')
    }

    const decoded = jwt_decode(jwtToken)

    if (this.props.appsLocal === null) {
      this.props.getAppsLocal(decoded.localId)
    }
    if (this.props.balesLocal === null) {
      this.props.getBalesLocal(decoded.localId)
    }
  }

  render() {
    const { baleLoading, balesLocal, appLoading, appsLocal } = this.props

    if (
      baleLoading === true ||
      balesLocal === null ||
      appLoading === true ||
      appsLocal === null
    ) {
      return <ActivityIndicator size="large" />
    }

    // console.log('appsLocal =>', appsLocal)

    // partition appsLocal by piljiOwner
    const partitionByPiljiOwner = _.values(
      _.groupBy(appsLocal, 'piljiOwner._id')
    )
    // console.log('partitionByPiljiOwner =>', partitionByPiljiOwner)
    // console.log('partitionByPiljiOwner.length =>', partitionByPiljiOwner.length)

    // 총 신청건수: 대기 건수, 승인 건수, 리턴 건수
    let totalNumOfApps = 0
    let totalNumOfApprovedApps = 0
    let totalNumOfReturnedApps = 0

    partitionByPiljiOwner.forEach(appsByPiljiOwner => {
      totalNumOfApps += appsByPiljiOwner.length
      appsByPiljiOwner.forEach(app => {
        if (app.approvalDate) {
          totalNumOfApprovedApps++
        }
        if (app.returnDate && !app.approvalDate) {
          totalNumOfReturnedApps++
        }
      })
    })

    // console.log('partitionByPiljiOwnerObj =>', partitionByPiljiOwnerObj)

    // appsLocal.forEach(app => {
    //   totalNumOfApps += app.numPiljis
    //   totalNumOfApprovedApps += app.numApproved
    //   totalNumOfReturnedApps += app.numReturned
    // })

    let baleOwners = []
    balesLocal.forEach(bc => {
      baleOwners.push(bc._id.baleOwner)
    })
    baleOwners = _.uniq(baleOwners)

    let x = {}

    baleOwners.forEach(bo => {
      balesLocal.forEach(bl => {
        if (x[bo] === undefined) {
          x[bo] = {}
        }

        if (x[bo].localDeptCode === undefined) {
          x[bo].localDeptCode = bl._id.localDeptCode
        }

        if (x[bo].baleOwner === undefined && bo === bl._id.baleOwner) {
          x[bo].baleOwner = bl._id.baleOwner
          x[bo].baleOwnerName = bl._id.baleOwnerName
        }

        if (x[bo].piljiCount === undefined && bo === bl._id.baleOwner) {
          x[bo].piljiCount = 1
        } else if (bo === bl._id.baleOwner) {
          x[bo].piljiCount++
        }

        if (x[bo].balesCount === undefined && bo === bl._id.baleOwner) {
          x[bo].balesCount = bl.balesPerPilji
        } else if (bo === bl._id.baleOwner) {
          x[bo].balesCount += bl.balesPerPilji
        }
      })
    })

    const result = _.map(x, (value, baleOwner) => ({ baleOwner, ...value }))

    const summaryResult = result.reduce(
      (accmulator, currentValue) => {
        accmulator.numPiljis += currentValue.piljiCount
        accmulator.numBales += currentValue.balesCount
        return accmulator
      },
      { numPiljis: 0, numBales: 0 }
    )

    return (
      <ScrollView>
        <View>
          <View>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitleText}>파종 신청 현황</Text>
              <Button
                mode="contained"
                onPress={() =>
                  this.props.navigation.navigate('ApplicationMain')
                }
                style={styles.headerButton}
              >
                <Text style={styles.headerButtonText}>파종 신청 관리</Text>
              </Button>
            </View>
            <List.Item
              title={`총 파종 신청 수: ${totalNumOfApps}`}
              style={styles.listItem}
            />
            <List.Item
              title={`파종 신청 대기: ${totalNumOfApps -
                totalNumOfApprovedApps}`}
              style={styles.listItem}
            />
            <List.Item
              title={`파종 신청 승인: ${totalNumOfApprovedApps}`}
              style={styles.listItem}
            />
            <List.Item
              title={`파종 신청 반려: ${totalNumOfReturnedApps}`}
              style={styles.listItem}
            />
          </View>

          <View style={{ marginTop: 15 }}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitleText}>수확 현황</Text>
              <Button
                small
                onPress={() => this.props.navigation.navigate('BaleMain')}
                style={styles.headerButton}
              >
                <Text style={styles.headerButtonText}>상세 현황 보기</Text>
              </Button>
            </View>
          </View>

          <List.Item
            title={`재배 농민: ${result.length}`}
            style={styles.listItem}
          />
          <List.Item
            title={`필지: ${summaryResult.numPiljis}`}
            style={styles.listItem}
          />
          <List.Item
            title={`수확량: ${summaryResult.numBales}`}
            style={styles.listItem}
          />
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  balesLocal: state.bale.balesLocal,
  baleLoading: state.bale.loading,
  appsLocal: state.application.appsLocal,
  appLoading: state.application.loading
})

const mapDispatchToProps = dispatch => ({
  getAppsLocal: localId => dispatch(getAppsLocal(localId)),
  getBalesLocal: localId => dispatch(getBalesLocal(localId))
})

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ECEBF1',
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  headerTitleText: {
    fontSize: 16
  },
  headerButton: {
    backgroundColor: '#9E9E9E'
  },
  headerButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  listItem: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#9E9E9E'
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardMainScreen)
