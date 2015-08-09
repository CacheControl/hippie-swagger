'use strict';

var skeemas = require('skeemas');

module.exports = function response(pathSpec, res, body, next) {
  var schema = pathSpec.responses['200'].schema, //todo - 201
      result = skeemas.validate(body, schema);

  if(!result.valid) return next(new Error('Response failed validation against schema (' + schema + '): ' + result.errors[0]));

  next();
};