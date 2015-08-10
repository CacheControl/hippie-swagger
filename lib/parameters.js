'use strict';

var skeemas = require('skeemas'),
    objectAssign = require('object-assign');

function validateParam(spec, value) {
  var paramSchema = objectAssign({}, spec),
      paramValue = value;
  if(paramSchema.in === 'body') {
    paramSchema = paramSchema.schema; //"body" params are nest under schema
    paramValue = JSON.parse(value);
  }

  return skeemas.validate(paramValue, paramSchema);
}

module.exports = function parameters(pathSpec, options, parameters) {
  parameters = parameters || {};
  options = objectAssign({}, options);
  parameters = objectAssign({}, parameters);

  if(options.body) {
    parameters.body = options.body;
  }

  if(pathSpec.parameters && pathSpec.parameters.length) {
    pathSpec.parameters.forEach(function(param) {
      //check for existance of required parameters
      if(!Object.keys(parameters).length || parameters[param.name] === undefined && param.required) {
        throw new Error('Missing required parameter: ' + param.name + '.  Did you forget to call "params({' + param.name + ': value})"?');
      }
      //validate parameter against json-schema definition
      var result = validateParam(param, parameters[param.name]);
      if(!result.valid) throw new Error('Invalid format for parameter {' + param.name + '}, received: ' + parameters[param.name] + '.  errors:' + result.errors.join(','));

      //replace parameter in url
      var regex = new RegExp('{' + param.name + '}', 'g');
      options.url = options.url.replace(regex, parameters[param.name]);
    });
  }
  return options;
}