const express  = require('express');
// create router.
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

// Post model
const Post = require('../../models/Post');
//Profile model
const Profile = require('../../models/Profile');
// Post validations
const validatePostInput = require('../../validation/post');

// res.json outputs a json, this will be picked up by our frontend
// to work on later. another function we used was res.send in server.js
// the bracket with msg: is an object

// @route  GET api/posts/test
// @desc   Tests post route
// @access public
router.get('/test', (req, res) => res.json({msg: "Posts works"}));

// @route  GET api/posts
// @desc   Get post
// @access Public

router.get('/', (req, res) => {
  Post.find()
  .sort({date: -1})
  .then(posts => res.json(posts))
  .catch(err => res.status(404).json({nopostfound: 'no post found'}));
});


// @route  GET api/posts/:id
// @desc   Get post by id
// @access Public

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
  .then(post => res.json(post))
  .catch(err => res.status(404).json({nopostfound: "No post found with that id"}));
});

// @route  POST api/posts
// @desc   Create post
// @access Private
router.post('/', passport.authenticate('jwt',{session : false}),
(req, res) => {

  const { errors, isValid } = validatePostInput(req.body);


  // Check validation
  if(!isValid){
    // If any erorrs, send 400 with error Object
    return res.status(400).json(errors);
  }

  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id
  });


  newPost.save().then(post => res.json(post));
});



// @route  DELETE api/posts/:id
// @desc   Delete the post
// @access Private

router.delete('/:id', passport.authenticate('jwt',{session : false}),
(req, res) => {
  Profile.findOne({ user: req.user.id })
  .then(profile => {
    Post.findById(req.params.id)
    .then(post => {
      // check for post owner
      // req.user.id would be a string whereas post.user wouldn't
      // hence adding toString to avoid problems in comparison
      if(post.user.toString() !== req.user.id) {
        return res.status(401).json({ notauthorized: 'user not authorized'});
      }

      // Delete post now
      post.remove().then(() => res.json({ success: true}));
    })
    .catch(err => res.status(404).json({ postnotfound: 'no post found'}));
  });

});

// ---------------------------Like and unlike posts ----------------------------

// @route  POST api/posts/like/:id
// @desc   Like post
// @access Private

router.post('/like/:id', passport.authenticate('jwt',{session : false}),
(req, res) => {
  Profile.findOne({ user: req.user.id })
  .then(profile => {
    Post.findById(req.params.id)
    .then(post => {
      // if length is greater than 0 then user has already liked it
      if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
        return res.status(400).json({alreadyliked: 'User already liked the post'});
      }
      // didnt like already so add user id to like array

      post.likes.unshift({ user: req.user.id });

      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'no post found'}));
  });

});


// @route  POST api/posts/unlike/:id
// @desc   unlike post
// @access Private

router.post('/unlike/:id', passport.authenticate('jwt',{session : false}),
(req, res) => {
  Profile.findOne({ user: req.user.id })
  .then(profile => {
    Post.findById(req.params.id)
    .then(post => {
      // if length is greater than 0 then user has already liked it
      if(post.likes.filter(like => like.user.toString() === req.user.id).length == 0) {
        return res.status(400).json({notliked: 'You have not yet liked this post'});
      }

      // get remove index

      // map over the entire likes array and get the array of users from it,
      // once we have that, convert user toString and find the indexOf our current user
      // since we are searching for our user.
      const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);


      // splice out of array
      post.likes.splice(removeIndex,1);

      post.save().then(post => res.json(post));
    })
    .catch(err => res.status(404).json({ postnotfound: 'no post found'}));
  });

});



//--------------------------------Add/ delete comments--------------------------

// @route  POST api/posts/comment/:id
// @desc   Add comment to a post
// @access Private


router.post('/comment/:id', passport.authenticate('jwt',{session : false}),
(req, res) => {
  const { errors, isValid } = validatePostInput(req.body);


  // Check validation
  if(!isValid){
    // If any erorrs, send 400 with error Object
    return res.status(400).json(errors);
  }


  Post.findById(req.params.id)
  .then(post => {
    const newComment = {
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    }
    // add to comments array
    post.comments.unshift(newComment);

    // save
    post.save().then(post => res.json(post));
  })
  .catch(err => res.status(404).json({ postnotfound: 'no post found'}));
});

// @route  POST api/posts/comment/:id/:comment_id
// @desc   REMOVE comment from a post
// @access Private


router.delete('/comment/:id/:comment_id', passport.authenticate('jwt',{session : false}),
(req, res) => {


  Post.findById(req.params.id)
  .then(post => {
    // CHECK if the comment exists
    if(post.comments.filter(
          comment =>
              comment._id.toString() === req.params.comment_id).length === 0) {
      // comment does not exist since length is 0
      console.log('are wr here?');
      return res.status(400).json({ commentnotexists: 'comment does not exist'});
    }

    // get remove index
    const removeIndex = post.comments
     .map(comment => comment._id.toString())
     .indexOf(req.params.comment_id);

     //Make sure only the comment owner can delete comment
     if (req.user.id !== post.comments[removeIndex].user.toString()) {
         return res.status(401).json({ notauthorized: "User not authorized" });
     }

     post.comments.splice(removeIndex, 1);
     post.save().then(post => res.json(post));
  })
  .catch(err => res.status(404).json({ postnotfound: 'no post found'}));
});


// export the router so server.js can pick it up
module.exports = router;
