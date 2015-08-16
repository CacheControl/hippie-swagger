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

  //From swagger specifications: "If this field does not exist,
  //it means no content is returned as part of the response"
  if(schema) {
    var result = skeemas.validate(body, schema, { breakOnError:true });
    if(!result.valid) return next(new Error('Response from ' + res.request.path + ' failed validation: ' + result.errors.join(',')));
  } else if(body.length) {
    return next(new Error('Received non-empty response from ' + res.request.path + '. Expected empty response body because no "schema" property was specified in swagger path.'));
  }
  next();
};