'use strict';

import * as TYPES from '../actions/types';

const initialState = {
  hasInfo: false,
  info: {},
  status: null,
};

//status字段和type一样用来标记一个异步方法执行过程中的不同状态，比type可靠
export default function user(state=initialState, action){

  switch(action.type){
    case TYPES.GET_DOING:
      return {
        ...state,
        status: 'doing'
      };
    case TYPES.GET_IN:
      return {
        ...state,
        hasInfo: true,
        user: action.info,
        status: 'done'
      };
    case TYPES.GET_OUT:
      return {
        ...state,
      };
    case TYPES.GET_ERROR:
      return {
        ...state,
        status: 'error'
      }
    default:
      return state;
  }

}