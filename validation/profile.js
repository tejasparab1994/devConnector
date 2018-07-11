const Validator = require('validator');
const isEmpty = require('./is-empty');

// we are returning this function from this file which can be accessed from
// which ever file that requires this file.
module.exports = function validateProfileInput(data) {
  let errors = {};

  // the validator's isEmpty only checks for empty string, but when the name
  // field would be left empty, it would be an empty object.
  // hence we send the data.(anything) first to our custom isEmpty function
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  if(!Validator.isLength(data.handle, { min: 2, max: 30 })) {
    errors.handle = 'Handle needs to be between 2 and 4 characters';
  }

  if(Validator.isEmpty(data.handle)) {
    errors.handle = 'Profile Handle is required';
  }

  if(Validator.isEmpty(data.status)) {
    errors.status = "Status field is required"
  }

  if(Validator.isEmpty(data.skills)) {
    errors.skills = "Skills field is required"
  }

  if(!isEmpty(data.website)){
    if(!Validator.isURL(data.website)) {
      errors.website = 'Not a valid URL';
    }
  }
  if(!isEmpty(data.youtube)){
    if(!Validator.isURL(data.youtube)) {
      errors.youtube = 'Not a valid URL';
    }
  }
  if(!isEmpty(data.twitter)){
    if(!Validator.isURL(data.twitter)) {
      errors.twitter = 'Not a valid URL';
    }
  }
  if(!isEmpty(data.facebook)){
    if(!Validator.isURL(data.facebook)) {
      errors.facebook = 'Not a valid URL';
    }
  }
  if(!isEmpty(data.linkedin)){
    if(!Validator.isURL(data.linkedin)) {
      errors.linkedin = 'Not a valid URL';
    }
  }
  if(!isEmpty(data.instagram)){
    if(!Validator.isURL(data.instagram)) {
      errors.instagram = 'Not a valid URL';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
