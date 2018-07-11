const Validator = require('validator');
const isEmpty = require('./is-empty');

// we are returning this function from this file which can be accessed from
// which ever file that requires this file.
module.exports = function validateRegisterInput(data) {
  let errors = {};


  // the validator's isEmpty only checks for empty string, but when the name
  // field would be left empty, it would be an empty object.
  // hence we send the data.whatever first to our custom isEmpty function
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';





  // not working


  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  // not working
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
