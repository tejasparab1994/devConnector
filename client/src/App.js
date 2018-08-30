import React, { Component } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import {Provider} from 'react-redux';
import jwt_decode from 'jwt-decode';
import store from './store';
import setAuthToken from './utils/setAuthToken';
import {setCurrentUser} from './actions/authActions';
import { logoutUser } from './actions/authActions';
import { clearCurrentProfile } from './actions/profileActions';

// check for token when page refreshes because without this we lose all the state
if(localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // dECODE Token and get user info and exp
  const decoded  = jwt_decode(localStorage.jwtToken);
  // set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // check for expired token
  const currentTime = Date.now() / 1000;
  if(decoded.exp < currentTime ) {
    // Logout the user
    store.dispatch(logoutUser());
    // clear current profile
    store.dispatch(clearCurrentProfile());
    // REDIRECT TO LOGIN
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store = {store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path = "/" component={ Landing } />
            <div className="container">
              <Route exact path = "/register" component= {  Register  } />
              <Route exact path = "/login" component= {  Login  } />
              <Route exact path = "/dashboard" component = { Dashboard } />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
