const express  = require('express');
const router = express.Router();

//for avatar
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Load user model
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
  // check first if email exists
  // pass an object to findOne, when we send data to a route
  // through a post request,which will ultimately be a form in
  // react application, we access it with request.body and then email
  User.findOne({ email: req.body.email })
  .then(user => {
    if(user) {
      return res.status(400).json({email: 'Email already exists'});
    }
    else {
      const avatar = gravatar.url(req.body.email,{
        s: '200' ,//size
        r: 'pg', //rating, pg or r and all that
        d: 'mm' //Default
      });
      //create a new user in mongoose
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });
      //callback will get back salt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt,(err, hash) => {
          if(err) throw err;
          newUser.password = hash;
          newUser.save()
          .then(user => res.json(user))
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
  .then(user => {
    //check for user
    if(!user) {
      return res.status(404).json({email: 'User not found'});
    }
    // check the password
    bcrypt.compare(password, user.password)
    .then(isMatch => {
      if(isMatch) {
        // User matched here
        //Sign the token
        jwt.sign();
      } else {
        return res.status(400).json({password: 'Password wrong'});
      }
    })
  });
});




// export the router so server.js can pick it up
module.exports = router;
