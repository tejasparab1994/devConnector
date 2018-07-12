const express  = require('express');

//create a router
const router = express.Router();

const mongoose  = require('mongoose');
const passport = require('passport');

// Load validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');
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
// protected route through the entire passport thing
router.get('/', passport.authenticate('jwt', {  session: false  }),
(req, res) => {
  // for all the errors we want to display
  const errors = {};

  Profile.findOne({ user: req.user.id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'there is no profile for this user';
        return res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});


// @route  GET api/profile/all
// @desc   Get all profiles
// @access Public


router.get('/all', (req, res) => {
  const errors = {};
  Profile.find()
  .populate('user', ['name', 'avatar'])
  .then(profiles => {
    if(!profiles){
      errors.noprofile = 'there are no profiles';
      return res.status(404).json(errors);
    }

    res.json(profiles);
  })
  .catch(err => res.status(404).json({profile: 'There are no profiles'}));
});

// @route  GET api/profile/handle/:handle
// @desc   Get profile by handle
// @access Public

router.get('/handle/:handle', (req, res) => {
  const errors ={};
  // get handle from the url using req.params.handle
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});


// @route  GET api/profile/user/:user_id
// @desc   Get profile by user ID
// @access Public

router.get('/users/:user_id', (req, res) => {
  const errors ={};
  // get handle from the url using req.params.handle
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if(!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json({profile: 'There is no profile for this user'}));
});





// @route  POST api/profile
// @desc   Create or Edit user profile
// @access Private


// using the jwtstrategy that we created in config/passport.js
// protected route through the entire passport thing
router.post('/', passport.authenticate('jwt', {  session: false  }),
(req, res) => {

  const { errors, isValid } = validateProfileInput(req.body);


  //check validation
  if(!isValid){
    //return any errors with 400 status
    return res.status(400).json(errors);
  }

  // GET FIELDS
  const profileFieds = {};
  profileFieds.user = req.user.id;
  // checking in with whether req.body.handle was sent in from the form, if
  // yes then we set the profilefields
  if(req.body.handle) profileFieds.handle = req.body.handle;
  if(req.body.company) profileFieds.company = req.body.company;
  if(req.body.website) profileFieds.website = req.body.website;
  if(req.body.location) profileFieds.location = req.body.location;
  if(req.body.bio) profileFieds.bio = req.body.bio;
  if(req.body.status) profileFieds.status = req.body.status;
  if(req.body.githubusername) profileFieds.githubusername = req.body.githubusername;

  //skills will come in as comma separated values,, need to split into an array
  if (typeof req.body.skills !== 'undefined') {
    profileFieds.skills = req.body.skills.split(',');
  }

  //social is an object of fields in model
  profileFieds.social = {}
  if(req.body.youtube) profileFieds.social.youtube = req.body.youtube;
  if(req.body.linkedin) profileFieds.social.linkedin = req.body.linkedin;
  if(req.body.twitter) profileFieds.social.twitter = req.body.twitter;
  if(req.body.instagram) profileFieds.social.instagram = req.body.instagram;
  if(req.body.facebook) profileFieds.social.facebook = req.body.facebook;

  //find the logged in user using the id
  Profile.findOne({ user: req.user.id })
    .then(profile => {
      if(profile) {
        //since here, we want to just UPDATE the profile
        // search for the entry with user, set the entry with values from profileFieds
        // The default is to return the unaltered document.
        // If you want the new, updated document to be returned you have to pass
        // an additional argument: an object with the new property set to true.
        Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFieds }, { new: true})
          .then(profile => res.json(profile));
      }
      else {
        //CREATE, since if block skipped
        // check if handle already exists
        Profile.findOne({ handle: profileFieds.handle }).then(profile => {
          if( profile ) {
            // handle exists
            errors.handle = 'That handle already exists';
            res.status(400).json(errors);
          }

          // Save profile since handle doesnt exist and new profile into the db
          // and then json the profile
          new Profile(profileFieds).save().then(profile => res.json(profile));
        });
      }
    });

});


// @route  POST api/profile/experience
// @desc   Add experience to profile
// @access Private

router.post('/experience', passport.authenticate('jwt', {  session: false  }),
  (req,res) => {
    const { errors, isValid } = validateExperienceInput(req.body);


    //check validation
    if(!isValid){
      //return any errors with 400 status
      return res.status(400).json(errors);
    }

    Profile.findOne({ user : req.user.id })
      .then(profile => {
        const newExp =  {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        }

        //Add to experience array
        profile.experience.unshift(newExp);


        profile.save().then(profile => res.json(profile));
      })
      .catch()
  });


  // @route  POST api/profile/education
  // @desc   Add education to profile
  // @access Private

  router.post('/education', passport.authenticate('jwt', {  session: false  }),
    (req,res) => {
      const { errors, isValid } = validateEducationInput(req.body);


      //check validation
      if(!isValid){
        //return any errors with 400 status
        return res.status(400).json(errors);
      }

      Profile.findOne({ user : req.user.id })
        .then(profile => {
          const newEdu =  {
            school: req.body.school,
            degree: req.body.degree,
            fieldofstudy: req.body.fieldofstudy,
            from: req.body.from,
            to: req.body.to,
            current: req.body.current,
            description: req.body.description
          }

          //Add to education array
          profile.education.unshift(newEdu);


          profile.save().then(profile => res.json(profile));
        })
        .catch()
    });


// export the router so server.js can pick it up
module.exports = router;
