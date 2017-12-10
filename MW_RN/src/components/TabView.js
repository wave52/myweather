/**
 * 2017.3.14
 * @伍成然
 */
'use strict';

import React, { Component } from 'react'
import {
  Dimensions,
  StyleSheet,
  Animated,
  Image,
  View,
  Text
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import TabNavigator from 'react-native-tab-navigator'
import px2dp from '../utils/px2dp'
let {width, height} = Dimensions.get('window')
import Home from '../pages/Home'
import Column from '../pages/Column'
import Member from '../pages/Member'
import My from '../pages/My'

export default class TabView extends Component {
  constructor(props){
    super(props)
    this.state={
      currentTab: 'Home',
      hideTabBar: false
    }
    this.tabContent = [
      ["首页","ios-home-outline","Home",<Home {...this.props}/>],
      ["栏目","ios-apps-outline","Column",<Column {...this.props}/>],
      ["会员","ios-ionic-outline","Member",<Member {...this.props}/>],
      ["我的","ios-person-outline","My",<My {...this.props}/>]
    ]
    TabView.hideTabBar = TabView.hideTabBar.bind(this)
    TabView.showTabBar = TabView.showTabBar.bind(this)
  }
  static showTabBar(){
    this.setState({hideTabBar: false})
  }
  static hideTabBar(){
    this.setState({hideTabBar: true})
  }
  render(){
    return (
      <TabNavigator
        hidesTabTouch={true}
        tabBarStyle={[styles.tabbar,
          (this.state.hideTabBar?styles.hide:{})
        ]}
        sceneStyle={{ paddingBottom: styles.tabbar.height }}>
          {
            this.tabContent.map((item, i) => {
              return (
                <TabNavigator.Item
                    key={i}
                    tabStyle={styles.tabStyle}
                    title={item[0]}
                    selected={this.state.currentTab === item[2]}
                    selectedTitleStyle={{color: "#fff"}}
                    renderIcon={() => <Icon name={item[1]} size={px2dp(22)} color="#fff" />}
                    renderSelectedIcon={() => <Icon name={item[1].replace(/\-outline$/, "")} size={px2dp(22)} color="#fff" />}
                    onPress={() => this.setState({ currentTab: item[2] })}>
                    {item[3]}
                </TabNavigator.Item>
              )
            })
          }
      </TabNavigator>
    )
  }
}

const styles = StyleSheet.create({
    tabbar: {
      flexDirection:'row',
      height: px2dp(49),
      alignItems:'center',
      justifyContent: 'center',
      backgroundColor: '#222'
    },
    hide: {
      transform: [
        {translateX:width}
      ]
    },
    tabStyle:{
      padding: px2dp(4)
    }
})