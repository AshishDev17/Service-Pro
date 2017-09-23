'use strict';
import { combineReducers } from 'redux';

//import all sub reducers
// import students from './students';
import user from './user';

const rootReducer = combineReducers({
  user
});


export default rootReducer;
