
'use strict';

import React, {Component, PropTypes} from 'react';
import {StyleSheet, View, Text, PanResponder, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import px2dp from '../utils/px2dp';
import NavBar from '../components/NavBar'

const width = Dimensions.get('window').width

export default class OrderContentPage extends Component{
    constructor(props){
        super(props);
        this.names = ['温度','湿度','风力','空气','降雨','潮汐','穿衣'];
        this.items = [];
        this.order = [];
    }
    back(){
      this.props.navigator.pop()
    }
    render(){
        return(
          <View style={styles.container}>
              <NavBar
                title="模块设置"
                leftIcon="ios-arrow-back"
                leftPress={this.back.bind(this)}
              />
              {this.names.map((item, i)=>{
                  this.order.push(item);
                  return (
                      <View
                          {...this._panResponder.panHandlers}
                          ref={(ref) => this.items[i] = ref}
                          key={i}
                          style={[styles.item, {top: (i+2)*49-30}]}>
                          <Icon name="ios-menu" size={px2dp(25)} color="#ccc"/>
                          <Text style={styles.itemTitle}>{item}</Text>
                      </View>
                  );
              })}
          </View>
        );
    }

    componentWillMount(){
        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                const {pageY, locationY} = evt.nativeEvent;
                this.index = this._getIdByPosition(pageY);
                this.preY = pageY - locationY;
                //get the taped item and highlight it
                let item = this.items[this.index];
                item.setNativeProps({
                    style: {
                        shadowColor: "#000",
                        shadowOpacity: 0.3,
                        shadowRadius: 5,
                        shadowOffset: {height: 0, width: 2},
                        elevation: 5
                    }
                });
            },
            onPanResponderMove: (evt, gestureState) => {
                let top = this.preY + gestureState.dy;
                let item = this.items[this.index];
                item.setNativeProps({
                    style: {top: top}
                });

                let collideIndex = this._getIdByPosition(evt.nativeEvent.pageY);
                if(collideIndex !== this.index && collideIndex !== -1) {
                    let collideItem = this.items[collideIndex];
                    collideItem.setNativeProps({
                        style: {top: this._getTopValueYById(this.index)}
                    });
                    //swap two values
                    [this.items[this.index], this.items[collideIndex]] = [this.items[collideIndex], this.items[this.index]];
                    [this.order[this.index], this.order[collideIndex]] = [this.order[collideIndex], this.order[this.index]];
                    this.index = collideIndex;
                }
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                const shadowStyle = {
                    shadowColor: "#000",
                    shadowOpacity: 0,
                    shadowRadius: 0,
                    shadowOffset: {height: 0, width: 0,},
                    elevation: 0
                };
                let item = this.items[this.index];
                //go back the correct position
                item.setNativeProps({
                    style: {...shadowStyle, top: this._getTopValueYById(this.index)}
                });
                console.log(this.order);
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // Another component has become the responder, so this gesture
                // should be cancelled
            }
        });
    }

    _getIdByPosition(pageY){
        var id = -1;
        const height = px2dp(49);

        if(pageY >= height*2-30 && pageY < height*3-30)
            id = 0;
        else if(pageY >= height*3-30 && pageY < height*4-30)
            id = 1;
        else if(pageY >= height*4-30 && pageY < height*5-30)
            id = 2;
        else if(pageY >= height*5-30 && pageY < height*6-30)
            id = 3;
        else if(pageY >= height*6-30 && pageY < height*7-30)
            id = 4;
        else if(pageY >= height*7-30 && pageY < height*8-30)
            id = 5;
        else if(pageY >= height*8-30 && pageY < height*9-30)
            id = 6;
        return id;
    }

    _getTopValueYById(id){
        const height = px2dp(49);
        return (id + 2) * height - 30;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
    },
    item: {
        flexDirection: 'row',
        height: px2dp(49),
        width: width,
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingLeft: px2dp(20),
        borderBottomColor: '#fff',
        borderBottomWidth: 1,
        position: 'absolute',
        // marginTop: 20,
    },
    itemTitle: {
        fontSize: px2dp(15),
        color: '#000',
        marginLeft: px2dp(20)
    }
});