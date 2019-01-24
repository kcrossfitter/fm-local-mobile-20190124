import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
  FlatList,
  StyleSheet,
  View
} from 'react-native'
import { Button, List, Text } from 'react-native-paper'

import jwt_decode from 'jwt-decode'
import _ from 'lodash'
import { MapView } from 'expo'

import Spinner from '../../components/spinner'
import { getAppsLocal } from '../../actions/applicationActions'
import { GOOGLE_MAP_KEY } from '../../config'

class ApplicationMainScreen extends Component {
  state = {
    localId: null,
    showMap: false,
    mapLoading: false,
    region: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0
    },
    locations: []
  }

  componentDidMount = async () => {
    const jwtToken = await AsyncStorage.getItem('jwtToken')

    if (!jwtToken) {
      this.props.navigation.navigage('SignIn')
    }

    const decoded = jwt_decode(jwtToken)

    this.setState({ localId: decoded.localId })

    if (this.props.appsLocal === null) {
      this.props.getAppsLocal(decoded.localId)
    }
  }

  _showMap = () => {
    // 숨기기 버튼을 눌렀을 때, 후속 작업 불필요
    if (this.state.showMap) {
      this.setState({ showMap: false })
      return
    }

    this.setState({ showMap: true, mapLoading: true })

    const { appsLocal } = this.props
    let locations = []
    let center = { lat: 0, lng: 0 }

    const promises = appsLocal.map(async al => {
      const {
        forageSpecies: { koreanName },
        pilji: { jibeon },
        piljiOwner: { name }
      } = al

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${jibeon}&key=${GOOGLE_MAP_KEY}`
      )
      const geocodeData = await response.json()

      const { lat, lng } = geocodeData.results[0].geometry.location

      return {
        latlng: { latitude: lat, longitude: lng },
        title: jibeon,
        description: `초종: ${koreanName}, 소유주: ${name}`
      }
    })

    Promise.all(promises).then(responses => {
      for (let i = 0; i < responses.length; i++) {
        locations.push(responses[i])
      }

      for (let i = 0; i < locations.length; i++) {
        center.lat += locations[i].latlng.latitude
        center.lng += locations[i].latlng.longitude
      }

      center.lat = center.lat / locations.length
      center.lng = center.lng / locations.length

      this.setState({
        region: {
          latitude: center.lat,
          longitude: center.lng,
          latitudeDelta: 0.135,
          longitudeDelta:
            (Dimensions.get('window').width / Dimensions.get('window').height) *
            0.135
        },
        locations,
        mapLoading: false
      })
    })
    this.setState({ mapLoading: false })
  }

  render() {
    const { appLoading, appsLocal } = this.props

    if (appLoading === true || appsLocal === null) {
      return <Spinner size="large" />
    }

    console.log('appsLocal =>', appsLocal)

    let partitionByPiljiOwnerObj = {}
    let partitionByPiljiOwnerObjArray = []

    partitionByPiljiOwnerObj = _.groupBy(appsLocal, 'piljiOwner._id')
    for (let key in partitionByPiljiOwnerObj) {
      partitionByPiljiOwnerObjArray.push({
        key: key,
        value: partitionByPiljiOwnerObj[key]
      })
    }

    // 총 신청건수: 대기 건수, 승인 건수, 리턴 건수
    let totalNumOfApps = 0
    let totalNumOfApprovedApps = 0
    let totalNumOfReturnedApps = 0

    partitionByPiljiOwnerObjArray.forEach(appsByPiljiOwner => {
      totalNumOfApps += appsByPiljiOwner.value.length
      appsByPiljiOwner.value.forEach(app => {
        if (app.approvalDate) {
          totalNumOfApprovedApps++
        }
        if (app.returnDate && !app.approvalDate) {
          totalNumOfReturnedApps++
        }
      })
    })

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitleText}>파종신청현황 요약</Text>
          <View style={{ flexDirection: 'row' }}>
            <Button
              mode="contained"
              onPress={() =>
                this.props.navigation.navigate('ApplicationProcess')
              }
              style={[styles.headerButton, { marginRight: 10 }]}
            >
              <Text style={styles.headerButtonText}>신청 처리</Text>
            </Button>
            <Button
              mode="contained"
              onPress={this._showMap}
              style={styles.headerButton}
            >
              <Text style={styles.headerButtonText}>
                {this.state.showMap ? '지도 숨기기' : '신청 위치 보기'}
              </Text>
            </Button>
          </View>
        </View>

        <List.Item
          title={`재배 농민: ${
            appsLocal.length
          } / 파종 신청: ${totalNumOfApps} / 승인: ${totalNumOfApprovedApps} / 반려: ${totalNumOfReturnedApps} / 대기: ${totalNumOfApps -
            totalNumOfApprovedApps}`}
          style={styles.listItem}
        />

        {this.state.showMap &&
          (this.state.mapLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <MapView
              style={{ width: '100%', height: 300 }}
              region={this.state.region}
            >
              {this.state.locations.map(loc => (
                <MapView.Marker
                  key={loc.title}
                  coordinate={loc.latlng}
                  title={loc.title}
                  description={loc.description}
                />
              ))}
            </MapView>
          ))}

        <View style={[styles.headerContainer, { marginTop: 15 }]}>
          <Text style={styles.headerTitleText}>필지 소유주별 현황 요약</Text>
        </View>

        <View style={{ flex: 1 }}>
          <FlatList
            data={partitionByPiljiOwnerObjArray}
            keyExtractor={item => item.key}
            renderItem={({ item }) => {
              let numApps = item.value.length

              let numApproved = 0
              let numReturned = 0
              let pending = 0

              item.value.forEach(it => {
                if (it.approvalDate) {
                  numApproved++
                }
                if (it.returnDate && !it.approvalDate) {
                  numReturned++
                }
              })

              pending = numApps - numApproved

              return (
                <List.Item
                  title={item.value[0].piljiOwner.name}
                  description={`신청: ${numApps}, 승인: ${numApproved}, 반려: ${numReturned}, 대기: ${pending}`}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                  style={styles.listItem}
                  onPress={() =>
                    this.props.navigation.navigate('ApplicationsPerFarmer', {
                      localId: this.state.localId,
                      farmerId: item.key
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
  appLoading: state.application.loading,
  appsLocal: state.application.appsLocal
})

const mapDispatchToProps = dispatch => ({
  getAppsLocal: localId => dispatch(getAppsLocal(localId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationMainScreen)
