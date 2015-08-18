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

function assertNoExtraParameters(pathSpec, parameters) {
  var pathSpecParamHash = pathSpec.parameters.reduce(function(hash, param) {
    hash[param.name] = param;
    return hash;
  }, {});
  Object.keys(parameters).forEach(function(type) {
    if(type == 'header') return; //don't subject header variables to swagger mention
    Object.keys(parameters[type]).forEach(function(param) {
      if(!pathSpecParamHash[param]) {
        throw new Error('Parameter not mentioned in swagger spec: "' + param + '", available params: ' +
          pathSpec.parameters.map(function(p) {
            return p.name;
          }).join(',')
        );
      }
    });
  });
}

module.exports = function parameters(pathSpec, options, parameters) {
  parameters = parameters || {};
  options = objectAssign({}, options);
  parameters = objectAssign({}, parameters),
  pathSpec.parameters = pathSpec.parameters || [];

  if(options.body) {
    parameters.body = { body: options.body };
  }
  if(options.headers) {
    parameters.header = objectAssign({}, options.headers);
  }
  if(options.qs) {
    parameters.query = objectAssign({}, options.qs);
  }

  assertNoExtraParameters(pathSpec, parameters);

  if(pathSpec.parameters && pathSpec.parameters.length) {
    //validate provided parameters
    pathSpec.parameters.forEach(function(param) {
      //check for existance of required parameters
      if(!Object.keys(parameters).length ||
         parameters[param.in] === undefined ||
         parameters[param.in][param.name] === undefined) {
        if(param.required) {
          throw new Error('Missing required parameter in ' + param.in + ': ' + param.name);
        }
        return true; //not required; carry on.
      }
      //validate parameter against json-schema definition
      var result = validateParam(param, parameters[param.in][param.name]);
      if(!result.valid) throw new Error('Invalid format for parameter {' + param.name + '}, received: ' + parameters[param.in][param.name] + '.  errors:' + result.errors.join(','));

      //replace pathParams in url
      if(param.in == 'path') {
        var regex = new RegExp('{' + param.name + '}', 'g');
        options.url = options.url.replace(regex, parameters[param.in][param.name]);
      }
    });
  }
  return options;
}