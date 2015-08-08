'use strict';

var skeemas = require('skeemas');

function handleParameters(spec, path, parameters) {
  var requestURI = path;
  if(!spec.parameters || !spec.parameters.length) {
    return requestURI;
  }
  spec.parameters.forEach(function(param) {
    //check for existance of required parameters
    if(parameters[param.name] === undefined && param.required) {
      throw new Error('Missing required parameter: ' + param.name);
    }
    //validate parameter against json-schema definition
    var isValid = skeemas.validate(parameters[param.name], param).valid;
    if(!isValid) throw new Error('Invalid format for parameter {' + param.name + '}, received: '+ parameters[param.name]);

    //replace parameter in url
    var regex = new RegExp('{' + param.name + '}', 'g');
    requestURI = requestURI.replace(regex, parameters[param.name]);
  });
  return requestURI;
}

module.exports = function(swaggerDef, path, parameters) {
  parameters = parameters || [];
  return function(options, next) {
    if(!swaggerDef.paths[path]) {
      throw new Error('Swagger spec does not define path: ' + path);
    }
    if(!options.method) {
      throw new Error('options must specify a request method(get, post, delete, etc)');
    }
    if(!swaggerDef.paths[path][options.method]) {
      throw new Error('Swagger spec does not define method: ' + options.method);
    }
    var spec = swaggerDef.paths[path][options.method];

    //default to json
    //if(!spec.consumes || spec.consumes.includes('application/json')) {
    //  //todo - set request options for this.json();
    //}
    var requestURI = handleParameters(spec, path, parameters);
    //todo validate the response using json-schema
    options.url = options.url + requestURI;
    next(options);
  };
}