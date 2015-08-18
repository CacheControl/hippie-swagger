'use strict';

var skeemas = require('skeemas');

module.exports = function response(pathSpec, res, body, next) {
  var statusCode = pathSpec.responses[res.statusCode];
  if(statusCode === undefined) {
    return next(new Error('No mention of statusCode: ' + res.statusCode + ' in ' + res.request.path));
  }

  var schema = statusCode.schema;
  if(schema) {
    var result = skeemas.validate(body, schema, { breakOnError:true });
    if(!result.valid) return next(new Error('Response from ' + res.request.path + ' failed validation: ' + result.errors.join(',')));
  } else if(body.length) {
    //From swagger specifications: "If this field(statusCode.schema) does not exist,
    //it means no content is returned as part of the response"
    return next(new Error('Received non-empty response from ' + res.request.path + '. Expected empty response body because no "schema" property was specified in swagger path.'));
  }
  next();
};