const Validator = require('validator');
const isEmpty = require('./is-empty');

// we are returning this function from this file which can be accessed from
// which ever file that requires this file.
module.exports = function validateExperienceInput(data) {
  let errors = {};


  // the validator's isEmpty only checks for empty string, but when the name
  // field would be left empty, it would be an empty object.
  // hence we send the data.whatever first to our custom isEmpty function
  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';
  // not working


  if (Validator.isEmpty(data.school)) {
    errors.school = 'School field is required';
  }


  if (Validator.isEmpty(data.degree)) {
    errors.degree = 'Degree field is required';
  }

  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = 'Field of study is required';
  }


  if (Validator.isEmpty(data.from)) {
    errors.from = 'From field is required';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
