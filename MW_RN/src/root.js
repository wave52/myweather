import React, { Component } from 'react';
import { Navigator, StatusBar, Platform, StyleSheet, Text, View } from 'react-native';
import Wrapper from './components/Wrapper'
import Swipper from './components/Swipper'
import Home from './views/Home'
import API from './utils/api'


export default class Root extends Component {
  constructor(props){
    super(props)
  }
  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((position) => {
      var lastPosition = JSON.stringify(position);
      this.setState({lastPosition});
    });
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }
  render() {
    return (
      <View style={{flex: 1, backgroundColor: "#eee"}}>
        <StatusBar
          backgroundColor="#fff"
          barStyle="light-content"
          color="#fff"
        />
        <Navigator
          initialRoute={{component: Swipper}}
          configureScene={() => Navigator.SceneConfigs.FloatFromRight}
          renderScene={(route, navigator) => {
              return <route.component navigator={navigator} {...route.args}/>
            }
          }
        />
      </View>
    );
  }
}
