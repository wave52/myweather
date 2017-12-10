/**
 * 2017.3.21
 * @伍成然
 * 全局样式,注意 y轴属性/字体/圆角 需用px2dp()
 */
'use strict';

import {PixelRatio, Dimensions, Platform} from 'react-native';
import px2dp from '../utils/px2dp';

const isIOS = Platform.OS === "ios"
const globalTextColor = '#222';

module.exports = {
  screenWidth: Dimensions.get('window').width,
  screenHeight: Dimensions.get('window').height,
  themeColor: '#1e91c6',
  pageBackgroundColor: '#f4f4f4',
  blueColor: '#2095cb',
  btnActiveOpacity: 0.7,
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#222",
    height: px2dp(isIOS?64:42),
    paddingTop: px2dp(isIOS?20:0),
    paddingHorizontal: 10
  },
  btn:{
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#222",
    height:px2dp(40),
    borderRadius:px2dp(5),
  }
};