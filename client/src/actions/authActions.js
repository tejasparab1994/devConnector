import { GET_ERRORS } from './types';
import axios from 'axios';

// Register user

export const registerUser = (userData, history) => dispatch => {
  // we need to call the axios api, fetching from backend and actually wait, so this is where the thunk
  // middleware comes into picture so add dispatch here.
  axios.post('/api/users/register', userData)
    .then(res => history.push('/login'))
    // if we get error we dispatch an action_type called get_errors, again thunk
    // since async call
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
};
