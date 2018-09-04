import axios from 'axios';

import { SET_CURRENT_USER,GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_ERRORS, GET_PROFILES} from './types';


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

// Add Experience
export const addExperience = (expData, history) => dispatch => {
  axios.post('/api/profile/experience', expData)
  .then(res => history.push('/dashboard'))
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
};

// Delete Experience
export const deleteExperience = (id, history) => dispatch => {
  axios.delete(`/api/profile/experience/${id}`)
  .then(res =>
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
  )
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
};

// Delete account and profile
export const deleteAccount = () => dispatch => {
  if(window.confirm("Aew you sure? this cannot be undone")) {
    axios
    .delete('/api/profile')
    .then(res =>
      dispatch({
        type: SET_CURRENT_USER,
        payload: {}
      })
    ).catch(err => dispatch ({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
}
}


// Add education
export const addEducation = (eduData, history) => dispatch => {
  axios.post('/api/profile/education', eduData)
  .then(res => history.push('/dashboard'))
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
};

// delete education
export const deleteEducation = id => dispatch => {
  axios.delete(`/api/profile/education/${id}`)
  .then(res =>
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    })
  )
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
};



// get all profiles
export const getProfiles = () => dispatch => {
  dispatch(setProfileLoading());

  axios.get('/api/profile/all')
  .then(res =>
    dispatch({
      type: GET_PROFILES,
      payload: res.data
    })
  )
  .catch(err =>
    dispatch({
      type: GET_PROFILES,
      payload: null
    })
  );
};


export const getProfileByHandle = (handle) => dispatch => {
  // another action within thi which sets loading to true... hence another dispatch
  dispatch(setProfileLoading());
  axios.get(`/api/profile/handle/${handle}`)
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
      payload: null
    })
  );
}
