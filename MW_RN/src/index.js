import React, { Component } from 'react';
import { Provider } from 'react-redux';

import configureStore from './store/index';

let store = configureStore();

import Root from './root'

export default class Index extends Component {
  constructor(props){
    super(props)
    this.state={
      store: configureStore(()=>{console.log('constructor')})
    }
  }
  render() {
    console.log('render');
    return (
      <Provider store={this.state.store}>
        <Root />
      </Provider>
    );
  }
}
