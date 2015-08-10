'use strict';

var skeemas = require('skeemas');

function getSchemaByStatusCode(res, pathSpec) {
  var schema;
  switch(res.request.method) {
    case 'GET':
      schema = pathSpec.responses['200'].schema;
      break;
    case 'POST':
      schema = pathSpec.responses['201'].schema;
      break;
  }
  return schema;
}

module.exports = function response(pathSpec, res, body, next) {
  var schema = getSchemaByStatusCode(res, pathSpec);

  var result = skeemas.validate(body, schema, { breakOnError:true });
  if(!result.valid) return next(new Error('Response from ' + res.request.path + ' failed validation: ' + result.errors.join(',')));
  next();
};