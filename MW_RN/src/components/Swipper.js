import React,{ Component } from 'react';
import { Platform,Image,ScrollView,StatusBar,StyleSheet,Text,TouchableWithoutFeedback,
  TouchableHighlight,View,PixelRatio,Dimensions } from 'react-native';
// import '../utils/px2dp';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import Home from '../views/Home'
import Modules from '../views/Modules'
import Special from '../views/Special'
import px2dp from '../utils/px2dp'
import Setting from '../views/Setting'
import Search from '../views/Search'
import API from '../utils/api'

const isIOS = Platform.OS == "ios"
const pixel = 1 / PixelRatio.get()
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

class Swipper extends Component{
  constructor(props) {
    super(props);
    this.state={
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      baseInfo:""
    }
  }
  goSetting(){
    this.props.navigator.push({
      component: Setting,
      args:{}
    })
  }
  goSearch(){
    this.props.navigator.push({
      component: Search,
      args:{}
    })
  }
  _renderFixHeader() {
    var {city} = this.state
    var {info} = this.props
    console.log(info)
    return <View style={styles.header}>
      <TouchableWithoutFeedback onPress={this.goSearch.bind(this)}>
        <Icon name="ios-search-outline" size={26} color="#fff" />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback>
        <View style={{width:60,flexDirection:'row',justifyContent:'center',alignItems:'center'}}>
          <Icon name="ios-pin-outline" size={26} color="#fff" />
          <Text style={{fontSize: 14, color:"#fff", marginLeft: 5}}>{info.name}</Text>
        </View>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={this.goSetting.bind(this)}>
        <Icon name="ios-settings-outline" size={26} color="#fff" />
      </TouchableWithoutFeedback>
    </View>
  }
  render() {
    return(
      <View>
        <Swiper
        showsButtons={false}
        paginationStyle={{bottom:10, borderTopColor:"rgba(255,255,255,0)",borderTopWidth:pixel}}
        dot={<View style={{backgroundColor: 'rgba(255,255,255,0.2)', width: 6, height: 6, borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
        activeDot={<View style={{backgroundColor: 'rgba(255,255,255,0.5)', width: 6, height: 6, borderRadius: 3, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}>
          <Home/>
          <Modules {...this.props}/>
          <Special/>
        </Swiper>
        {this._renderFixHeader()}
      </View>
    )
  }
}

function select(store){
  return {
    hasInfo: store.baseStore.hasInfo,
    info: store.baseStore.info,
    status: store.baseStore.status
  }
}

export default connect(select)(Swipper);

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    width: width,
    height: px2dp(isIOS?64:44),
    paddingTop: px2dp(isIOS?20:0),
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor:'transparent'
  },
})