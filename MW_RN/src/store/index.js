/**
 * 2017.3.21
 * @伍成然
 */
'use strict';

import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import reducers from '../reducers';

//日志记录
const logger = store => next => action => {
  if(typeof action === 'function') console.log('dispatching a function');
  else console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
}

//崩溃报告
const crashReporter = store => next => action => {
  try {
    return next(action)
  } catch (err) {
    console.error('Caught an exception!', err)
    Raven.captureException(err, {
      extra: {
        action,
        state: store.getState()
      }
    })
    throw err
  }
}

//组合中间件
let middlewares = [
  logger,
  crashReporter,
  thunk
];

let createAppStore = applyMiddleware(...middlewares)(createStore);

//使用redux-persist：persistStore(store, [config, callback]) 用于本地持久化存储
export default function configureStore(callback: ()=>void){
  const store = autoRehydrate()(createAppStore)(reducers);
  let config = {
    storage: AsyncStorage,
    transform: [],
    //whitelist: ['userStore'],
  };
  persistStore(store, config, callback);
  return store;
}


