const Validator =  require('validator');
const isEmpty = require('./is-empty');


// we are returning this function from this file which can be accessed from
// which ever file that requires this file.
module.exports = function validateRegisterInput(data) {
  let errors = {};

  if(!Validator.isLength(data.name, { min: 2, max: 30})) {
    errors.name = 'Name must be between 2 and 30 characters';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
