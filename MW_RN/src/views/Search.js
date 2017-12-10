'use strict';
import React, { Component } from 'react';
import { Platform,Image,ScrollView,StatusBar,StyleSheet,Text,TouchableNativeFeedback,TouchableHighlight,TouchableOpacity,
  View,PixelRatio,Dimensions,TouchableWithoutFeedback,RefreshControl,TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import px2dp from '../utils/px2dp'
import theme from '../config/theme'
const isIOS = Platform.OS === "ios"
export default class Setting extends Component {
  constructor(props) {
    super(props);
    this.state={}
  }
  back(){
    this.props.navigator.pop()
  }
  iconRender(){
    if(Platform.OS === 'android'){
      return (
        <TouchableNativeFeedback onPress={this.back.bind(this)} style={styles.btn}>
          <Icon name="ios-arrow-back" size={px2dp(26)} color="#fff" />
        </TouchableNativeFeedback>
      )
    }else{
      return (
        <TouchableOpacity onPress={this.back.bind(this)} style={styles.btn}>
          <Icon name="ios-arrow-back" size={px2dp(26)} color="#fff" />
        </TouchableOpacity>
      )
    }
  }
  render(){
    return (
      <View style={{flex: 1, backgroundColor: "#f4f4f4"}}>
        <View style={styles.topbar}>
          {this.iconRender()}
          <View style={styles.searchContainer}>
            <TextInput ref="search" style={styles.textInput} underlineColorAndroid="transparent" placeholder="请输入地址" placeholderTextColor="#666"/>
          </View>
        </View>
        <ScrollView>
          <Text>1</Text>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  topbar: theme.navBar,
  btn: {
    width: 40,
    height: px2dp(40),
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchContainer: {
    width: theme.screenWidth-60,
    height: px2dp(40),
    paddingVertical: px2dp(6)
  },
  textInput: {
    fontSize: 13,
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 0,
    height: px2dp(28),
    borderRadius: px2dp(6),
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center'
  },
})