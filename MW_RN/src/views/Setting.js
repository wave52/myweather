import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  StyleSheet
} from 'react-native'
import NavBar from '../components/NavBar'
import Item from '../components/Item'
import ModuleEdit from './ModuleEdit'

export default class Setting extends Component {
  constructor(props){
    super(props)
    this.state = {
      user:this.props.user,
      on:[true,true,true,true,true]
    }
  }
  // 返回
  back(){
    this.props.navigator.pop()
  }
  goModuleEdit(){
    this.props.navigator.push({
      component:ModuleEdit,
      args:{}
    })
  }
  handleSwitch(num){
    var on = this.state.on
    on[num]=!on[num]
    this.setState({on:on})
  }
  render(){
    let { user } = this.state
    return (
      <View style={{flex: 1, backgroundColor: "#f4f4f4"}}>
        <NavBar
          title="设置"
          leftIcon="ios-arrow-back"
          leftPress={this.back.bind(this)}
        />
        <ScrollView>
          <Item name="自动定位" switchBtn={true} isSwitchOn={this.state.on[0]} onPress={this.handleSwitch.bind(this,0)}/>
          <Item name="模块管理" onPress={this.goModuleEdit.bind(this)}/>
          <Item name="关于我们" first={true}/>
          <Item name="意见反馈" />
          <Item name="当前版本" subName="v1.0.0"/>
        </ScrollView>
      </View>
    )
  }
}