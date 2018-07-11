// created our own empty function because validators isEmpty checks only for
// the empty string. We could have also used lodash but we currently have
// too many libraries being used....

const isEmpty = value =>
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0);


module.exports = isEmpty; 
