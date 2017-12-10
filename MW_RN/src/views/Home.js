'use strict';
import React,{ Component } from 'react';
import { Platform,Image,ScrollView,StatusBar,StyleSheet,Text,TouchableHighlight,
  View,PixelRatio,Dimensions,TouchableWithoutFeedback,RefreshControl } from 'react-native';
// import '../utils/px2dp';
import { connect } from 'react-redux';
import { location } from '../actions/base'
import Icon from 'react-native-vector-icons/Ionicons';
import Swiper from 'react-native-swiper';
import px2dp from '../utils/px2dp'
import API from '../utils/api'
import theme from '../config/theme'
import Chart from 'react-native-chart';

const data = [
    [0, 1],
    [1, 3],
    [3, 7],
    [4, 9],
];
const isIOS = Platform.OS == 'ios'
const pixel = 1 / PixelRatio.get()
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const days=[{key:21,day:'\u661f\u671f\u4e00',icon:'ios-partly-sunny',high:21,low:16},{key:22,day:'\u661f\u671f\u4e8c',icon:'ios-rainy',high:22,low:14},{key:23,day:'\u661f\u671f\u4e09',icon:'ios-rainy',high:21,low:11},{key:24,day:'\u661f\u671f\u56db',icon:'ios-rainy',high:12,low:8},{key:25,day:'\u661f\u671f\u4e94',icon:'ios-rainy',high:9,low:7},{key:26,day:'\u661f\u671f\u516d',icon:'ios-partly-sunny',high:13,low:9},{key:27,day:'\u661f\u671f\u65e5',icon:'ios-rainy',high:17,low:13},{key:28,day:'\u661f\u671f\u4e00',icon:'ios-partly-sunny',high:18,low:14},{key:29,day:'\u661f\u671f\u4e8c',icon:'ios-partly-sunny',high:22,low:17}]

class Home extends Component {
  constructor(props) {
    super(props);
    this.state={
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      isRefreshing: false,
    }
  }
  _onRefresh(){
    this.setState({isRefreshing: true});
    setTimeout(() => {
      this.setState({isRefreshing: false});
    }, 1500)
  }
  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
        this.props.dispatch(location(initialPosition))
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
    const dayView = days.map((dayElem, dayIndex) => {
      return (
        <View key={dayElem.key} style={styles.withinWeekLine}>
          <View style={styles.withinWeekDay}>
            <Text style={styles.withinWeekDayText}>{dayElem.day}</Text>
          </View>
          <View style={styles.withinWeekIcon}>
            <Icon name={dayElem.icon}  style={styles.withinWeekIconIcon} size={25}></Icon>
          </View>
          <View style={styles.withinWeekDegree}>
            <Text style={styles.withinWeekHigh}>{dayElem.high}</Text>
            <Text style={styles.withinWeekLowNight}>{dayElem.low}</Text>
          </View>
        </View>
      );
    });
    return <View style={{flex:1,backgroundColor:'rgba(148,198,221,1)'}}>
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
        <View style={styles.container}>
          <Chart
            style={styles.chart}
            data={data}
            verticalGridStep={5}
            type="line"
         />
        </View>
        <View style={{height:px2dp(328),flexDirection:'column',justifyContent:'center'}}>
          <View style={styles.update}>
            <View><Text style={{fontSize:12,color:'#fff'}}>65 良</Text></View>
            <View><Text style={{fontSize:12,color:'#f8f8f8'}}>9秒前发布</Text></View>
          </View>
          <View style={styles.main}>
            <View style={{flexDirection:'row'}}>
              <Text style={{fontSize:85,fontWeight:'300',color:'#fff'}}>25</Text>
              <Text style={{marginTop:px2dp(10),fontSize:35,fontWeight:'100',color:'#fff'}}>°</Text>
            </View>
            <Text style={{color:'#fff'}}>阴/南风 微风徐徐</Text>
            <TouchableWithoutFeedback>
              <View>
                <Text style={{color:'#fff'}}>反馈天气</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
        {/*<ScrollView  horizontal={true} showsHorizontalScrollIndicator={false} style={styles.withinDayHoursContainer}> 
          <View style={styles.withinDayHours}>
            {hourView}
          </View>
        </ScrollView>*/}
        <View style={styles.withinWeek}>
          {dayView}
        </View>
      </ScrollView>
    </View>
  }
}

function select(store){
  return {
    hasInfo: store.baseStore.hasInfo,
    info: store.baseStore.info,
    status: store.baseStore.status
  }
}

export default connect(select)(Home);

const styles = StyleSheet.create({
  scrollView: {
    marginTop: px2dp(isIOS?64:44),
  },
  update: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    width: theme.screenWidth,
  },
  withinWeekLine:{
    flexDirection:'row',
    height: 28
  },
  withinWeekDay:{
    justifyContent:'center',
    alignItems:'flex-start',
    flex:1,
  },
  withinWeekIcon:{
    justifyContent:'center',
    alignItems:'center',
    flex:1,
  },
  withinWeekDegree:{
    justifyContent:'flex-end',
    alignItems:'center',
    flex:1,
    flexDirection:'row',
    paddingRight:25,
  },
  withinWeekHigh:{
    color:'#fff',
    width:35,
    fontSize:16,
    textAlign:'right'
  },
  main: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  chart: {
    width: 200,
    height: 200
  }
})