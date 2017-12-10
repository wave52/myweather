
import React,{ Component } from 'react';
import { Platform,Image,ScrollView,StatusBar,StyleSheet,Text,TouchableHighlight,
  View,PixelRatio,Dimensions,TouchableWithoutFeedback,RefreshControl } from 'react-native';
// import '../utils/px2dp';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import px2dp from '../utils/px2dp'
import ModuleEdit from './ModuleEdit.js'
const isIOS = Platform.OS == "ios"
const pixel = 1 / PixelRatio.get()
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

export default class Modules extends Component {
  constructor(props) {
    super(props);
    this.state={
      isRefreshing:false,
    }
  }
  _onRefresh(){
    this.setState({isRefreshing: true});
    setTimeout(() => {
      this.setState({isRefreshing: false});
    }, 1500)
  }
  goModuleEdit(){
    this.props.navigator.push({
      component:ModuleEdit,
      args:{}
    })
  }
  render() {
    return <View style={{flex:1,backgroundColor:"#222"}}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh.bind(this)}
            colors={['#222', '#0398ff']}
          />
        }
      >
        <View style={{flexDirection:'column',justifyContent: 'center'}}>
          <Card/>
          <Card/>
          <Card/>
          <Card/>
          <Card/>
          <View style={{width:width,height:px2dp(50)}}>
          <TouchableWithoutFeedback onPress={this.goModuleEdit.bind(this)}>
            <View style={styles.circleButton}>
              <Text>+</Text>
            </View>
          </TouchableWithoutFeedback>
          </View>
        </View>
      </ScrollView>
    </View>
  }
}

class Card extends Component {
  constructor(props){
    super(props)
    this.state={}
  }
  goProfile() {
    alert(1)
  }
  render() {
    return <TouchableWithoutFeedback onPress={this.goProfile.bind(this)}>
      <View style={styles.card}></View>
    </TouchableWithoutFeedback>
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex:1,
    marginTop: px2dp(isIOS?64:44),
    paddingHorizontal: 20,
    marginBottom: px2dp(30),
  },
  card: {
    height: px2dp(150),
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#444",
    padding: 16,
    marginBottom: px2dp(20),
    borderRadius: 5,
  },
  circleButton: {
    height: px2dp(50),
    width: 50,
    borderRadius: px2dp(25),
    backgroundColor: "#444",
    justifyContent: "center",
    alignItems: "center",
    position:'absolute',
    right: width/2
  }
})