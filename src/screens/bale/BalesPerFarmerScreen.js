import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native'
import { Button, List, Searchbar, Text } from 'react-native-paper'
import { MapView } from 'expo'

import { getBalesLocalFarmer } from '../../actions/baleActions'
import Spinner from '../../components/spinner'

const GOOGLE_MAP_KEY = 'AIzaSyDd3fERsmXLIsh7eSEtd-WKmd-8T7QpOog'

class BalesPerFarmerScreen extends Component {
  state = {
    region: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0,
      longitudeDelta: 0
    },
    locations: [],
    showMap: false,
    mapLoading: false,
    localId: null,
    farmerId: null,
    searchTerm: '',
    filteredBales: null
  }

  componentDidMount = () => {
    const localId = this.props.navigation.getParam('localId')
    const farmerId = this.props.navigation.getParam('farmerId')

    this.setState({ localId, farmerId })

    if (this.props.balesLocalFarmer === null) {
      this.props.getBalesLocalFarmer(localId, farmerId)
    }
  }

  _showMap = async balesLocalFarmer => {
    this.setState({ showMap: !this.state.showMap, mapLoading: true })

    let locations = []
    let center = { lat: 0, lng: 0 }

    const promises = balesLocalFarmer.map(async blf => {
      const {
        _id: { baleJibeon, baleOwnerName, forageSpeciesName },
        balesPerPilji
      } = blf

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${baleJibeon}&key=${GOOGLE_MAP_KEY}`
      )
      const geocodeData = await response.json()
      const { lat, lng } = geocodeData.results[0].geometry.location

      return {
        latlng: { latitude: lat, longitude: lng },
        title: baleJibeon,
        description: `소유주: ${baleOwnerName}, 초종: ${forageSpeciesName}, 수확량: ${balesPerPilji}`
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
    const { balesLocalFarmer } = this.props

    const searchedBales = balesLocalFarmer.filter(baleSet => {
      const {
        _id: { baleJibeon, forageSpeciesName }
      } = baleSet
      if (
        baleJibeon.indexOf(searchTerm) !== -1 ||
        forageSpeciesName.indexOf(searchTerm) !== -1
      ) {
        return true
      }
      return false
    })

    this.setState({ searchTerm, filteredBales: searchedBales })
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

  render() {
    const { baleLoading, balesLocalFarmer } = this.props
    const { localId, farmerId, filteredBales, showMap, mapLoading } = this.state

    if (baleLoading === true || balesLocalFarmer === null) {
      return <Spinner size="large" color="#80cbc4" />
    }

    const farmerBales = filteredBales ? filteredBales : balesLocalFarmer
    const totalPiljis = balesLocalFarmer.reduce((acc, currentVal) => {
      return acc + currentVal.balesPerPilji
    }, 0)

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitleText}>
            {balesLocalFarmer[0]._id.baleOwnerName}
          </Text>
          <Button
            mode="contained"
            onPress={() => this._showMap(balesLocalFarmer)}
            style={styles.headerButton}
          >
            <Text style={styles.headerButtonText}>
              {showMap ? '위치 숨기기' : '위치 보기'}
            </Text>
          </Button>
        </View>
        <List.Item
          title={`필지 수: ${balesLocalFarmer.length} / 수확량: ${totalPiljis}`}
          style={styles.listItem}
        />

        {showMap &&
          (mapLoading ? (
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
        <View style={{ marginTop: 15, flex: 1 }}>
          <FlatList
            data={farmerBales}
            keyExtractor={item => item._id.balePilji}
            ListHeaderComponent={this._renderHeader}
            stickyHeaderIndices={[0]}
            renderItem={({ item }) => {
              const {
                _id: { baleJibeon, forageSpeciesName, balePilji },
                balesPerPilji
              } = item

              return (
                <List.Item
                  title={baleJibeon}
                  description={`초종: ${forageSpeciesName}, 수확량: ${balesPerPilji}`}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                  style={styles.listItem}
                  onPress={() =>
                    this.props.navigation.navigate('BalesPerPilji', {
                      localId: localId,
                      farmerId: farmerId,
                      piljiId: balePilji
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
  baleLoading: state.bale.loading,
  balesLocalFarmer: state.bale.balesLocalFarmer
})

const mapDispatchToProps = dispatch => ({
  getBalesLocalFarmer: (localId, farmerId) =>
    dispatch(getBalesLocalFarmer(localId, farmerId))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BalesPerFarmerScreen)
