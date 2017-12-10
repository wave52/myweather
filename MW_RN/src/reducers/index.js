
import { combineReducers } from 'redux';
import baseReducer from './base';

export default combineReducers({
  baseStore: baseReducer,
});