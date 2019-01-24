import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { Button, List } from 'react-native-paper'
import { MapView } from 'expo'

import Spinner from '../../components/spinner'
import format from 'date-fns/format'
import { getBalesLocalFarmerPilji } from '../../actions/baleActions'

const GOOGLE_MAP_KEY = 'AIzaSyDd3fERsmXLIsh7eSEtd-WKmd-8T7QpOog'

class BalesPerPiljiScreen extends Component {
  state = {
    region: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0
    },
    latlng: {
      latitude: 0,
      longitude: 0
    },
    localId: null,
    farmerId: null,
    piljiId: null,
    showMap: false,
    mapLoading: false,
    baleJibeon: null
  }

  componentDidMount = () => {
    const { getParam } = this.props.navigation
    const { balesLocalFarmerPilji, getBalesLocalFarmerPilji } = this.props

    const localId = getParam('localId')
    const farmerId = getParam('farmerId')
    const piljiId = getParam('piljiId')

    this.setState({ localId, farmerId, piljiId })

    if (balesLocalFarmerPilji === null) {
      getBalesLocalFarmerPilji(localId, farmerId, piljiId)
    }
  }

  _showMap = async baleJibeon => {
    this.setState({ showMap: !this.state.showMap, mapLoading: true })

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${baleJibeon}&key=${GOOGLE_MAP_KEY}`
    )
    const geocodeData = await response.json()
    const { lat, lng } = geocodeData.results[0].geometry.location

    this.setState({
      region: {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.0122,
        longitudeDelta:
          (Dimensions.get('window').width / Dimensions.get('window').height) *
          0.0122
      },
      latlng: {
        latitude: lat,
        longitude: lng
      },
      baleJibeon,
      mapLoading: false
    })
  }

  render() {
    const { baleLoading, balesLocalFarmerPilji } = this.props

    if (baleLoading === true || balesLocalFarmerPilji === null) {
      return <Spinner size="large" />
    }

    const {
      baleJibeon,
      baleOwnerName,
      forageSpeciesName
    } = balesLocalFarmerPilji[0]

    return (
      <ScrollView>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitleText}>{baleJibeon}</Text>
          <Button
            mode="contained"
            onPress={() => this._showMap(baleJibeon)}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>
              {this.state.showMap ? '위치 숨기기' : '위치 보기'}
            </Text>
          </Button>
        </View>
        <List.Item
          title={`필지 소유주: ${baleOwnerName}`}
          style={styles.listItem}
        />
        <List.Item
          title={`생산량: ${balesLocalFarmerPilji.length}`}
          style={styles.listItem}
        />
        <List.Item
          title={`초종: ${forageSpeciesName}`}
          style={styles.listItem}
        />

        {this.state.showMap &&
          (this.state.mapLoading ? (
            <ActivityIndicator size="large" />
          ) : (
            <MapView
              style={{ width: '100%', height: 250 }}
              region={this.state.region}
            >
              <MapView.Marker
                coordinate={this.state.latlng}
                title={this.state.baleJibeon}
                description={`소유주: ${baleOwnerName}, 초종: ${forageSpeciesName}, 수확량: ${
                  balesLocalFarmerPilji.length
                }`}
              />
            </MapView>
          ))}
        <View style={{ padding: 10, marginTop: 15 }}>
          {balesLocalFarmerPilji.map(
            ({ _id, pressure, productionDate }, idx) => (
              <List.Accordion
                key={_id}
                title={`${idx + 1}. 곤포: ${_id}`}
                style={{
                  backgroundColor: '#e0f2f1',
                  borderBottomColor: '#4db6ac',
                  borderBottomWidth: StyleSheet.hairlineWidth
                }}
              >
                <List.Item
                  title={`압축 압력: ${pressure}`}
                  style={styles.listItemAccordian}
                />
                <List.Item
                  title={`수확일: ${format(
                    productionDate,
                    'YYYY:MM:DD HH:mm:ss'
                  )}`}
                  style={styles.listItemAccordian}
                />
              </List.Accordion>
            )
          )}
        </View>
      </ScrollView>
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
  },
  listItemAccordian: {
    // marginVertical: 0,
    paddingVertical: 0,
    paddingLeft: 15,
    backgroundColor: '#fafafa'
    // paddingVertical: 2,
    // paddingLeft: 20
  }
})

const mapStateToProps = state => ({
  baleLoading: state.bale.loading,
  balesLocalFarmerPilji: state.bale.balesLocalFarmerPilji
})

const mapDispatchToProps = dispatch => ({
  getBalesLocalFarmerPilji: (localId, farmerId, piljiId) =>
    dispatch(getBalesLocalFarmerPilji(localId, farmerId, piljiId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BalesPerPiljiScreen)
