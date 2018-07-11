const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
// this is for mongoose database
// the fields in the database for user MODEL
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    // not required true here because actually we are getting it from the url
    // that we passed in at users.js api
  },
  date: {
    type: Date,
    default: Date.now
  },
});

// this is the model, users is the name we want to use and the second parameter
// is the schema we created up top, the UserSchema
module.exports = User = mongoose.model('users', UserSchema);
