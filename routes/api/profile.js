const express  = require('express');

//create a router
const router = express.Router();

const mongoose  = require('mongoose');
const passport = require('passport');



// Load Profile model
const Profile = require('../../models/Profile');
// Load user profile
const User = require('../../models/User');


// res.json outputs a json, this will be picked up by our frontend
// to work on later.another function we used was res.send in server.js
// the bracket with msg: is an object

// @route  GET api/profile/test
// @desc   Tests profile route
// @access public
router.get('/test', (req, res) => res.json({msg: "Profile works"}));


// @route  GET api/profile
// @desc   Get current users profile
// @access Private


// using the jwtstrategy that we created in config/passport.js
router.get('/', passport.authenticate('jwt', {  session: false  }),
(req, res) => {
  // for all the errors we want to display
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'there is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// export the router so server.js can pick it up
module.exports = router;
