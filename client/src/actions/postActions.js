import Axios from 'axios';


import { ADD_POST, CLEAR_ERRORS, GET_ERRORS, GET_POSTS, POST_LOADING, DELETE_POST, GET_POST} from './types';


//ADD POST
export const addPost = postData => dispatch => {
  dispatch(clearErrors());
  Axios
  .post('/api/posts', postData)
  .then(res =>
    dispatch({
      type: ADD_POST,
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


//get posts
export const getPosts = () => dispatch => {
  dispatch(setPostLoading());
  Axios
  .get('/api/posts')
  .then(res =>
    dispatch({
      type: GET_POSTS,
      payload: res.data
    })
  )
  .catch(err =>
    dispatch({
      type: GET_POSTS,
      payload: null
    })
  );
};


//get post
export const getPost = (id) => dispatch => {
  dispatch(setPostLoading());
  Axios
  .get(`/api/posts/${id}`)
  .then(res =>
    dispatch({
      type: GET_POST,
      payload: res.data
    })
  )
  .catch(err =>
    dispatch({
      type: GET_POST,
      payload: null
    })
  );
};


// Delete post
export const deletePost = id => dispatch => {
  Axios
  .delete(`/api/posts/${id}`)
  .then(res =>
    dispatch({
      type: DELETE_POST,
      payload: id
    })
  )
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
};

// Add like
export const addLike = id => dispatch => {
  Axios
  .post(`/api/posts/like/${id}`)
  .then(res =>
    dispatch(getPosts()))
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
};

// Remove like
export const removeLike = id => dispatch => {
  Axios
  .post(`/api/posts/unlike/${id}`)
  .then(res =>
    dispatch(getPosts()))
  .catch(err =>
    dispatch({
      type: GET_ERRORS,
      payload: err.response.data
    })
  );
};


//ADD comment
export const addComment = (id, commentData) => dispatch => {
  dispatch(clearErrors());
  Axios
  .post(`/api/posts/comment/${id}`, commentData)
  .then(res =>
    dispatch({
      type: GET_POST,
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


//delete comment
export const deleteComment = (id, commentId) => dispatch => {
  Axios
  .delete(`/api/posts/comment/${id}/${commentId}`)
  .then(res =>
    dispatch({
      type: GET_POST,
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

// set loading state
export const setPostLoading = () => {
  return {
    type: POST_LOADING
  }
}


// clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  }
}
