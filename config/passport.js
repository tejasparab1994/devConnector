// can read the passport-jwt documentation if difficult
// but most of this is standard stuff that needs to be done to use passport

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');

// comes from User.js where we created the users model
const User = mongoose.model('users');
const keys = require('../config/keys');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// the field we have
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  // new JwtStrategy(options, verify)
  // options is an object literal containing options to control how the token
  // is extracted from the request or verified
  // verify is a function with parameters, jwt_payload and done
  // jwt_payload is an object literal containing the decoded JWT jwt_payload
  // while done is a passport error first callback accepting arguments done(error, user, info)
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(jwt_payload);
    // this returns
    // { id: '5b46262148b3ea520914d457',
    //    name: 'Tejas Parab',
    //    avatar:
    //'//www.gravatar.com/avatar/db3dfd181580347568db62b054b3f5c6?s=200&r=pg&d=mm',
    // iat: 1531326251,
    // exp: 1531329851 }
    User.findById(jwt_payload.id)
        .then(user => {
          if(user){
            return done(null, user);
          }
          // when no user found
           return done(null, false);
        })
        .catch(err => console.log(err));
  })
);
};
