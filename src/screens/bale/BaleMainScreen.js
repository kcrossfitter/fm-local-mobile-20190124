import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  ActivityIndicator,
  AsyncStorage,
  FlatList,
  StyleSheet,
  View
} from 'react-native'
import { Button, List, Text } from 'react-native-paper'
import { MapView } from 'react-native-maps'
import jwt_decode from 'jwt-decode'
import _ from 'lodash'

import Spinner from '../../components/spinner'
import { getBalesLocal, getBalesLocalFarmer } from '../../actions/baleActions'

import BASE_URL from '../../config'

const GOOGLE_MAP_KEY = 'AIzaSyDd3fERsmXLIsh7eSEtd-WKmd-8T7QpOog'

class BaleMainScreen extends Component {
  state = {
    showMap: false,
    localId: null
    // loading: true
  }

  componentDidMount = async () => {
    const jwtToken = await AsyncStorage.getItem('jwtToken')

    if (!jwtToken) {
      return this.props.navigation.navigate('SignIn')
    }

    const decoded = jwt_decode(jwtToken)

    this.setState({ localId: decoded.localId })

    if (this.props.balesLocal === null) {
      this.props.getBalesLocal(decoded.localId)
    }
  }

  _showMap = () => {
    this.setState({
      showMap: !this.state.showMap
    })
  }

  // _getBalesCompanyFarmer = async result => {
  //   const { companyId } = this.state
  //   const promises = result.map(async r => {
  //     return fetch(`${BASE_URL}/api/bales/${companyId}/${r.baleOwner}`).then(
  //       res => res.json()
  //     )
  //   })

  //   Promise.all(promises => )

  //   this.setState({ loading: false })
  // }

  render() {
    const { balesLocal, baleLoading } = this.props

    if (baleLoading === true || balesLocal === null) {
      return <Spinner size="large" />
    }

    // console.log('balesLocal =>', balesLocal)

    let baleOwners = []
    balesLocal.forEach(bl => {
      baleOwners.push(bl._id.baleOwner)
    })
    baleOwners = _.uniq(baleOwners)

    // console.log('baleOwners =>', baleOwners)
    // console.log('baleOwners.length =>', baleOwners.length)

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

        // if (x[bo].baleOwnerName === undefined && bo === bl._id.baleOwner) {
        //   x[bo].baleOwnerName = bl._id.baleOwnerName
        // }

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

    // console.log('x =>', x)
    const result = _.map(x, (value, baleOwner) => ({ baleOwner, ...value }))
    // console.log('result =>', result)
    const summaryResult = result.reduce(
      (accmulator, currentValue) => {
        accmulator.numPiljis += currentValue.piljiCount
        accmulator.numBales += currentValue.balesCount
        return accmulator
      },
      { numPiljis: 0, numBales: 0 }
    )
    // console.log('summaryResult', summaryResult)

    // this._getBalesCompanyFarmer(result)

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitleText}>수확 현황 요약</Text>
          <Button
            mode="contained"
            onPress={this._showMap}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>
              {this.state.showMap ? '지도 숨기기' : '수확 위치 보기'}
            </Text>
          </Button>
        </View>

        <List.Item
          title={`재배 농민: ${result.length} / 필지: ${
            summaryResult.numPiljis
          } /
          수확량: ${summaryResult.numBales}`}
          style={styles.listItem}
        />

        {this.state.showMap && (
          <View style={{ height: 300 }}>
            <Text style={{ textAlign: 'center' }}>지도</Text>
          </View>
        )}

        <View style={[styles.headerContainer, { marginTop: 15 }]}>
          <Text style={styles.headerTitleText}>필지 소유주별 현황 요약</Text>
        </View>

        <View style={{ flex: 1 }}>
          <FlatList
            data={result}
            keyExtractor={item => item.baleOwner}
            renderItem={({ item }) => {
              const { baleOwner, baleOwnerName, balesCount, piljiCount } = item
              return (
                <List.Item
                  title={baleOwnerName}
                  description={`필지 수: ${piljiCount}, 수확량: ${balesCount}`}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                  style={styles.listItem}
                  onPress={() =>
                    this.props.navigation.navigate('BalesPerFarmer', {
                      localId: this.state.localId,
                      farmerId: baleOwner
                    })
                  }
                />
              )
            }}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
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

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  baleLoading: state.bale.loading,
  balesLocal: state.bale.balesLocal,
  balesLocalFarmer: state.bale.balesLocalFarmer
})

const mapDispatchToProps = dispatch => ({
  getBalesLocal: localId => dispatch(getBalesLocal(localId)),
  getBalesLocalFarmer: (localId, farmerId) =>
    dispatch(getBalesLocalFarmer(localId, farmerId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BaleMainScreen)
