import axios from 'axios';

import { GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_ERRORS} from './types';


// Get curent profile


export const getCurrentProfile = () => dispatch => {
  // another action within thi which sets loading to true... hence another dispatch
  dispatch(setProfileLoading());
  axios.get('/api/profile')
  .then(res =>
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
  )
  // HERE IF WE DO NOT GET A PROFILE, SO WE RETURN AN EMPTY OBJECT
  // IF IT IS AN EMPTY OBJECT then CREATE_PROFILE
  .catch(err =>
    dispatch({
      type: GET_PROFILE,
      payload: {}
    })
  );
}


// Create Profile
export const createProfile = (profileData, history) => dispatch => {
  axios
    .post('/api/profile', profileData)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
}



// profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  }
}


// clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE
  }
}
