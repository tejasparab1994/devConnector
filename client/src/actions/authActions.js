import { GET_ERRORS } from './types';
import { SET_CURRENT_USER } from './types';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';


// Register user

export const registerUser = (userData, history) => dispatch => {
  // we need to call the axios api, fetching from backend and actually wait,
  // so this is where the thunk
  // middleware comes into picture so add dispatch here.
  axios.post('/api/users/register', userData)
    .then(res => history.push('/login'))
    // redirecting using history here...
    // if we get error we dispatch an action_type called get_errors, again thunk
    // since async call
    .catch(err =>
      // dispatch an action type on failure, this is what thunk allows us to do
      dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
};



// Login - get user token

export const loginUser =  (userData) => dispatch => {
  axios.post('/api/users/login', userData)
    .then(res => {
      // Save to localStorage
      const {token} = res.data;
      // Set token to ls
      // localStorage stores only strings, remember that
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      // the token includes the user information, id, gravatar, name etc.
      // to decode this we need a module called jwt decode.
      setAuthToken(token);
      // Decode token here to get user data
      const decoded = jwt_decode(token);
      // set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
    dispatch ({
        type: GET_ERRORS,
        payload: err.response.data
    })
  );
};

// set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  }
}


export const logoutUser = () => dispatch => {
  // remove the token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove the authHeader
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  // PAYLOAD WILL BE EMPTY OBJECT HERE, HENCE IS-EMPTY WILL RETURN TRUE WHICH will
  // RESULT IN isAuthenticated TO FALSE 
  dispatch(setCurrentUser({}));
}
