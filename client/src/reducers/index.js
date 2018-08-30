import { combineReducers } from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import profileReducer from './profileReducer';
// this is the root reducer, we bring in all of the other reducers here.
export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer
});
