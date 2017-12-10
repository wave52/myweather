/**
* 2017.3.22
* @伍成然
*/
import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  PixelRatio
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import px2dp from '../utils/px2dp'

export default class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    let {iconName,placeholder,secureTextEntry,rightButton} = this.props
    return (
      <View>
        <View style={[styles.editView,rightButton?{ paddingRight: 80}:{}]}>
          <View style={{position:"absolute",left:8,top:px2dp(18)}}>
            <Icon name={iconName} size={px2dp(22)} color="#222" />
          </View>
          <TextInput
            style={styles.edit}
            underlineColorAndroid="transparent"
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            placeholderTextColor="#c4c4c4"
          />
        </View>
        <View style={{height: 2/PixelRatio.get(), backgroundColor:'#222'}}/>
        <View style={{position:'absolute',right:8,top:px2dp(22),backgroundColor:'#fff'}}>
          {rightButton}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  editView:{
    height: px2dp(48),
    justifyContent: 'center',
  },
  edit:{
    height: px2dp(40),
    fontSize: px2dp(14),
    paddingLeft: 30,
    paddingRight: 15,
    paddingTop: px2dp(12)
  },
})