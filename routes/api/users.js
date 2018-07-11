// we need express to use the router
const express  = require('express');

// create a router
const router = express.Router();

//for avatar
const gravatar = require('gravatar');
// to hash the password
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// keys.js import for JWT
const keys = require('../../config/keys');
const passport = require('passport');

// Load input validation
const validateRegisterInput = require('../../validation/register');

//Load user model
// we'll work with mongoose using this
const User = require('../../models/User');


// res.json outputs a json, this will be picked up by our frontend
// to work on later.another function we used was res.send in server.js
// the bracket with msg: is an object

// @route  GET api/users/test
// @desc   Tests users route
// @access public
router.get('/test', (req, res) => res.json({msg: "Users works"}));


// @route  GET api/users/register
// @desc   Register user
// @access public
router.post('/register',(req, res) => {
  //request.body includes everything sent to this route, name, email, password.
  const { errors, isValid } = validateRegisterInput(req.body);

  // check validation
  if(!isValid) {
    return res.status(400).json(errors);
  }
  // check first if email exists
  // pass an object to findOne, when we send data to a route
  // through a post request,which will ultimately be a form in
  // react application, we access it with request.body and then email
  // using mongoose method findOne,
  User.findOne({ email: req.body.email })
  .then(user => {
    if(user) {
      // status400 since user already exists, witha json passed stating
      // value exists
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    }
    else {
      // using the gravatar package with its methods...
      const avatar = gravatar.url(req.body.email,{
        s: '200' ,//size of the avatar
        r: 'pg', //rating, pg or r and all that
        d: 'mm' //Default
      });
      //create a new user in mongoose
      // this is how you create a new resource in mongoose, we had created a
      // model named User and have also brought it in here,
      // the data field will autogenerated.
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        // avatar: avatar before ES6, but now just avatar works since then
        // because both are same
        avatar,
        password: req.body.password,
      });
      //callback will get back salt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt,(err, hash) => {
          if(err) throw err;
          newUser.password = hash;
          // this again mongoose where we are saving the user.
          newUser.save()
          .then(newUser => res.json(newUser))
          .catch(err => console.log(err));
        })
      })
    }
  })
});

// @route  GET api/users/login
// @desc   Login user / Returning JWT Token(json web token)
// @access public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;


  //Find the user by Email
  User.findOne({email})
  // again using promise
  // we will be returned the user and thus from now on we can access the user
  // in the mongoDB using this
  .then(user => {
    //check for user
    if(!user) {
      // status 404, user not found....
      return res.status(404).json({email: 'User not found'});
    }
    // user found
    // check the password now, we compare the users entered password with
    // the hashed password in the database through user.password
    bcrypt.compare(password, user.password)
    // brcypt.compare will give a true or false value
    // which we use in isMatch
    .then(isMatch => {
      if(isMatch) {
        // User matched here
        //create jwt payload
        const payload = { id: user.id, name: user.name, avatar: user.avatar }

        //Sign the token
        //sign takes in a payload: what we want to include in the token
        // some user information, secret key, expiration.

        // jwt.sign(payload, secretOrPrivatKey, [options, callback])
        // read jwt documentation for more
        jwt.sign(payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            // if we get token back then
            // send this token as a response
            // bearer token, certain type of protocol
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          });
        }
        else {
          return res.status(400).json({ password: 'Password incorrect'  });
        }
      })
    });
  });

  // @route  GET api/users/current
  // @desc   return current user
  // @access private
  // whoever the token belongs to
  router.get('/current', passport.authenticate('jwt',{session : false}),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  });

  // export the router so server.js can pick it up
  module.exports = router;
