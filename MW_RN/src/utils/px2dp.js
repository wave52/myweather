/**
 * 2017.3.14
 * @伍成然
 * y轴属性/字体/圆角 需用px2dp()
 */
'use strict';

import { Dimensions } from 'react-native'

let {width, height} = Dimensions.get('window')

const basePx = 375

export default function px2dp(px) {
    return px *  width / basePx
}