'use strict';

var skeemas = require('skeemas'),
    objectAssign = require('object-assign');

function validateNoExtraParams(pathSpec, parameters) {
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

  function replacePathParams(param) {
    if(param.in == 'path') {
      var regex = new RegExp('{' + param.name + '}', 'g');
      options.url = options.url.replace(regex, parameters[param.in][param.name]);
    }
  }

  function validateRequiredParams(param) {
    //check for existance of required parameters
    if((parameters[param.in] === undefined ||
       parameters[param.in][param.name] === undefined) && param.required) {
        throw new Error('Missing required parameter in ' + param.in + ': ' + param.name);
    }
  }

  function validateParamSchema(param) {
    if(!parameters[param.in] || !parameters[param.in][param.name]) return;

    var paramSchema = objectAssign({}, param),
        paramValue = parameters[param.in][param.name];

    if(paramSchema.in === 'body') {
      paramSchema = paramSchema.schema; //"body" params are nested under schema
      paramValue = JSON.parse(paramValue);
    }

    var result = skeemas.validate(paramValue, paramSchema);
    if(!result.valid) {
      throw new Error('Invalid format for parameter {' + param.name + '}, received: ' + parameters[param.in][param.name] + '.  errors:' + result.errors.join(','));
    }
  }

  if(options.body) {
    parameters.body = { body: options.body };
  }
  if(options.headers) {
    parameters.header = objectAssign({}, options.headers);
  }
  if(options.qs) {
    parameters.query = objectAssign({}, options.qs);
  }

  validateNoExtraParams(pathSpec, parameters);

  pathSpec.parameters.forEach(function(param) {
    validateRequiredParams(param);
    validateParamSchema(param);
    replacePathParams(param);
  });
  return options;
}