/**
 * 2017.3.15
 * @伍成然
 */
'use strict';

import React, {
  Component,
  PropTypes
} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import px2dp from '../utils/px2dp'
import theme from '../config/theme'

export default class NavBar extends Component{
  static propTypes = {
    title: PropTypes.string,
    leftIcon: PropTypes.string,
    rightIcon: PropTypes.string,
    leftPress: PropTypes.func,
    rightPress: PropTypes.func,
    style: PropTypes.object
  }
  renderBtn(pos){
    let iconRender = (obj) => {
      const { name, onPress } = obj
      if(Platform.OS === 'android'){
        return (
          <TouchableNativeFeedback onPress={onPress} style={styles.btn}>
            <Icon name={name} size={px2dp(26)} color="#fff" />
          </TouchableNativeFeedback>
        )
      }else{
        return (
          <TouchableOpacity onPress={onPress} style={styles.btn}>
            <Icon name={name} size={px2dp(26)} color="#fff" />
          </TouchableOpacity>
        )
      }
    }
    let textRender = (obj) => {
      const { name, onPress } = obj
      if(Platform.OS === 'android'){
        return (
          <TouchableNativeFeedback onPress={onPress} style={styles.btn}>
            <Text style={{color:"#fff"}} >{name}</Text>
          </TouchableNativeFeedback>
        )
      }else{
        return (
          <TouchableOpacity  onPress={onPress} style={styles.btn}>
            <Text style={{color:"#fff"}}>{name}</Text>
          </TouchableOpacity>

        )
      }
    }
    if(pos == "left"){
      if(this.props.leftIcon){
        return iconRender({
          name: this.props.leftIcon,
          onPress: this.props.leftPress
        })
      }else if(this.props.leftText){
        return textRender({
          name: this.props.leftText,
          onPress: this.props.leftPress
        })
      }else{
        return (<View style={styles.btn}></View>)
      }
    }else if(pos == "right"){
      if(this.props.rightIcon){
        return iconRender({
          name: this.props.rightIcon,
          onPress: this.props.rightPress
        })
      }else if(this.props.rightText){
        return textRender({
          name: this.props.rightText,
          onPress: this.props.rightPress
        })
      }else{
        return (<View style={styles.btn}></View>)
      }
    }
  }
  render(){
    return(
      <View style={[styles.topbar, this.props.style]}>
        {this.renderBtn("left")}
        <Animated.Text numberOfLines={1} style={[styles.title, this.props.titleStyle]}>{this.props.title}</Animated.Text>
        {this.renderBtn("right")}
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
  title:{
    color: "#fff",
    fontSize: px2dp(18),
  }
});
