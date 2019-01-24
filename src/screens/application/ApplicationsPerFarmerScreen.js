import React, { Component } from 'react'
import { connect } from 'react-redux'

import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  StyleSheet,
  View
} from 'react-native'
import { Button, List, Searchbar, Text } from 'react-native-paper'
import { MapView } from 'expo'
import format from 'date-fns/format'

import Spinner from '../../components/spinner'
import { getAppsLocalFarmer } from '../../actions/applicationActions'
import { GOOGLE_MAP_KEY } from '../../config'

class ApplicationsPerFarmerScreen extends Component {
  state = {
    localId: null,
    farmerId: null,
    region: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0
    },
    locations: [],
    showMap: false,
    mapLoading: false,
    searchTerm: '',
    filteredApps: null
  }

  componentDidMount = () => {
    const localId = this.props.navigation.getParam('localId')
    const farmerId = this.props.navigation.getParam('farmerId')

    this.setState({ localId, farmerId })

    if (this.props.appsLocalFarmer === null) {
      this.props.getAppsLocalFarmer(localId, farmerId)
    }
  }

  _showMap = () => {
    if (this.state.showMap) {
      this.setState({ showMap: false, mapLoading: false })
      return
    }

    this.setState({ showMap: true, mapLoading: true })

    const { appsLocalFarmer } = this.props

    let locations = []
    let center = { lat: 0, lng: 0 }

    const promises = appsLocalFarmer.map(async alf => {
      const { pilji, forageSpecies, approvalDate } = alf

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${
          pilji.jibeon
        }&key=${GOOGLE_MAP_KEY}`
      )
      const geocodeData = await response.json()
      const { lat, lng } = geocodeData.results[0].geometry.location

      return {
        latlng: { latitude: lat, longitude: lng },
        title: pilji.jibeon,
        description: `초종: ${forageSpecies.koreanName}, 상태: ${
          approvalDate ? '승인 완료' : '진행 중'
        }`
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
          latitudeDelta: 0.035,
          longitudeDelta:
            (Dimensions.get('window').width / Dimensions.get('window').height) *
            0.035
        },
        locations,
        mapLoading: false
      })
    })
  }

  handleChangeSearchTerm = searchTerm => {
    const { appsLocalFarmer } = this.props

    const searchedApps = appsLocalFarmer.filter(appSet => {
      const {
        forageSpecies: { koreanName },
        pilji: { jibeon }
      } = appSet
      if (
        jibeon.indexOf(searchTerm) !== -1 ||
        koreanName.indexOf(searchTerm) !== -1
      ) {
        return true
      }
      return false
    })

    this.setState({ searchTerm, filteredApps: searchedApps })
  }

  _renderHeader = () => (
    <View style={{ backgroundColor: '#D9E2EA', padding: 5 }}>
      <Searchbar
        placeholder="검색..."
        placeholderTextColor="#72808C"
        onChangeText={this.handleChangeSearchTerm}
        value={this.state.searchTerm}
        autoCapitalize="none"
        autoCorrect={false}
        style={{ backgroundColor: '#AFB9C4' }}
      />
    </View>
  )

  _renderTitle = ({ approvalDate, returnDate, pilji }) => (
    <Text
      style={{
        color: `${approvalDate ? 'green' : returnDate ? 'red' : 'black'}`
      }}
    >
      {pilji.jibeon}
    </Text>
  )

  _renderDescription = ({
    forageSpecies,
    applicationDate,
    applicationEditDate,
    approvalDate,
    returnDate,
    returnReason
  }) => (
    <React.Fragment>
      <Text style={{ color: '#90a4ae' }}>
        초종: {forageSpecies.koreanName}, 신청:
        {format(applicationDate, 'YYYY.MM.DD HH:mm:ss')}
        {approvalDate
          ? `\n승인: ${format(approvalDate, 'YYYY.MM.DD HH:mm:ss')}`
          : '\n승인대기'}
        {returnDate &&
          !approvalDate &&
          `\n반려: ${format(
            returnDate,
            'YYYY.MM.DD HH:mm:ss'
          )}, 사유: ${returnReason}`}
        {applicationEditDate &&
          !approvalDate &&
          `\n수정: ${format(applicationEditDate, 'YYYY.MM.DD HH:mm:ss')}`}
      </Text>
    </React.Fragment>
  )

  _getSummary = () => {
    const { appsLocalFarmer } = this.props
    const totalNumOfApps = appsLocalFarmer.length
    let approvedNum = (returnedNum = pendingNum = 0)

    appsLocalFarmer.forEach(app => {
      if (app.approvalDate) {
        approvedNum++
      }
      if (app.returnDate && !app.approvalDate) {
        returnedNum++
      }
    })
    pendingNum = totalNumOfApps - approvedNum

    return { totalNumOfApps, approvedNum, returnedNum, pendingNum }
  }

  render() {
    const { appLoading, appsLocalFarmer } = this.props
    const { filteredApps, showMap, mapLoading } = this.state

    if (appLoading || !appsLocalFarmer) {
      return <Spinner size="large" />
    }

    const farmerApps = filteredApps ? filteredApps : appsLocalFarmer

    const {
      totalNumOfApps,
      approvedNum,
      returnedNum,
      pendingNum
    } = this._getSummary()

    console.log('appsLocalFarmer =>', appsLocalFarmer)

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitleText}>
            {appsLocalFarmer[0].piljiOwner.name}
          </Text>
          <Button
            mode="contained"
            onPress={() => this._showMap()}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>
              {showMap ? '위치 숨기기' : '위치 보기'}
            </Text>
          </Button>
        </View>

        <List.Item
          title={`신청: ${totalNumOfApps} / 승인: ${approvedNum} / 반려: ${returnedNum} / 대기: ${pendingNum}`}
        />

        {showMap &&
          (mapLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <MapView
              style={{ width: '100%', height: 250 }}
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

        <View style={{ marginTop: 15, flex: 1 }}>
          <FlatList
            data={farmerApps}
            keyExtractor={item => item._id}
            ListHeaderComponent={this._renderHeader}
            stickyHeaderIndices={[0]}
            renderItem={({ item }) => {
              return (
                <List.Item
                  title={this._renderTitle(item)}
                  description={this._renderDescription(item)}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                  onPress={() =>
                    this.props.navigation.navigate('ApplicationDetail', {
                      appDetail: item
                    })
                  }
                  style={styles.listItem}
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
  appsLocalFarmer: state.application.appsLocalFarmer
})

const mapDispatchToProps = dispatch => ({
  getAppsLocalFarmer: (localId, farmerId) =>
    dispatch(getAppsLocalFarmer(localId, farmerId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplicationsPerFarmerScreen)
