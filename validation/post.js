const Validator = require('validator');
const isEmpty = require('./is-empty');

// we are returning this function from this file which can be accessed from
// which ever file that requires this file.
module.exports = function validatePostInput(data) {
  let errors = {};


  // the validator's isEmpty only checks for empty string, but when the name
  // field would be left empty, it would be an empty object.
  // hence we send the data.whatever first to our custom isEmpty function
  data.text = !isEmpty(data.text) ? data.text : '';

  if(!Validator.isLength(data.text, {min:10, max:300})){
    errors.text = 'Post must be between 10 and 300 characters';
  }


  if (Validator.isEmpty(data.text)) {
    errors.text = 'Text field is required';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
