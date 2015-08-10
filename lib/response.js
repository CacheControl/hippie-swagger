'use strict';

var skeemas = require('skeemas');

module.exports = function response(pathSpec, res, body, next) {
  var schema = pathSpec.responses['200'].schema, //todo - 201
      result = skeemas.validate(body, schema, { breakOnError:true });
  if(!result.valid) return next(new Error('Response from ' + res.request.path + ' failed validation: ' + result.errors.join(',')));
  next();
};