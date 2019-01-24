import React, { Component } from 'react'
import { connect } from 'react-redux'

import { StyleSheet, View } from 'react-native'
import { Button, List, Text } from 'react-native-paper'

class ApplicationDetailScreen extends Component {
  state = {
    showMap: false
  }

  _showMap = () => {}

  _showStatus = (approvalDate, returnDate, applicationEditDate) => {
    console.log('approvalDate', approvalDate, typeof approvalDate)
    if (approvalDate) {
      return { message: '(파종 신청 승인 완료)', color: '#e3f2fd' }
    } else if (returnDate > applicationEditDate) {
      return { message: '(파종 신청 반려)', color: '#fff9c4' }
    } else {
      return { message: '(파종 신청 승인 대기)', color: '#ffffff' }
    }
  }

  render() {
    const {
      applicationDate,
      approvalDate,
      returnDate,
      applicationEditDate,
      forageCompany,
      forageSpecies,
      pilji,
      piljiOwner
    } = this.props.navigation.getParam('appDetail')
    const { showMap } = this.state

    const { message, color } = this._showStatus(
      approvalDate,
      returnDate,
      applicationEditDate
    )

    console.log('message', message, 'color', color)

    // console.log('appDetail =>', appDetail)
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitleText}>{piljiOwner.name}</Text>
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
        <View style={{ backgroundColor: color }}>
          <List.Item
            title={`초종: ${forageSpecies.koreanName}`}
            style={styles.listItem}
          />
          <List.Item title={`지번: ${pilji.jibeon}`} style={styles.listItem} />
          <List.Item
            title={`수확단: ${forageCompany.name}`}
            style={styles.listItem}
          />
          <List.Item
            title={`진행 경과: ${message}`}
            description={`파종신청일: ${applicationDate}\n승인일: ${approvalDate}`}
            style={styles.listItem}
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
    paddingVertical: 10,
    borderBottomColor: '#9E9E9E',
    borderBottomWidth: StyleSheet.hairlineWidth
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

export default connect()(ApplicationDetailScreen)
