import { SET_CURRENT_USER } from '../actions/types';
import isEmpty from '../validation/is-empty';

const initialState = {
  isAuthenticated: false,
  user: {}
}

export default function(state = initialState, action) {
  switch(action.type) {
    case SET_CURRENT_USER:
      return{
        ...state,
        // payload is gonna be an object with the decoded user
        // check to see that it is not empty
        isAuthenticated: !isEmpty(action.payload), 
        user: action.payload
      }
    default:
    return state;
  }
}
