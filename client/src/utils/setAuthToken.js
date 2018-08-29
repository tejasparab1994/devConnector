import axios from 'axios';

// so this function will help us to avoid checking manually whether there is an
// authorization token, and attach it rather this function will do it
// automatically every time we are logged in and an authorization token is present


const setAuthToken = token => {
  if(token) {
    // Apply to every request since exists
    axios.defaults.headers.common['Authorization'] = token;
  }
  else {
    // Delete the auth header
    delete axios.defaults.headers.common['Authorization'];
  }
}

export default setAuthToken;
