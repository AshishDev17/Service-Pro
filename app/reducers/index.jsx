'use strict';
import { combineReducers } from 'redux';

//import all sub reducers
// import students from './students';
import user from './user';
import error from './error';

const rootReducer = combineReducers({
  user, error
});


export default rootReducer;
