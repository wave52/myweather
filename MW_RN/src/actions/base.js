'use strict';

import { AlertIOS } from 'react-native';

import API from '../utils/api'
// import IMG from '../config/images'
import * as TYPES from './types';

// login
export function location(pos){
	return (dispatch) => {
		dispatch({'type': TYPES.GET_DOING});
		API.callJson('/location')(pos).then((data)=>{
			console.log(data)
			dispatch({
				type: TYPES.GET_IN,
				info: data
			});
		}).catch((msg)=>{
			dispatch({
				type: TYPES.GET_ERROR,
			});
		})
	}
}

// skip login
export function skipLogin(){
	return {
		'type': TYPES.LOGGED_IN,
		'user': skipUser,
	}
}

// logout
export function logOut(){
	return (dispatch) => {
		dispatch({'type': TYPES.LOGGED_OUT});
	}
}

// edit
export function editUser(user){
	return {
		'type': TYPES.LOGGED_IN,
		'user': user
	}
}