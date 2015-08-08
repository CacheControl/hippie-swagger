'use strict';

var hippie = require('hippie'),
    skeemas = require('skeemas');

hippie.prototype.params = function(parameters) {
  var self = this;
  this.swaggerParams = this.swaggerParams || {};
  Object.keys(parameters).forEach(function(k) {
    self.swaggerParams[k] = parameters[k];
  });
  return this;
};

function handleParameters(pathSpec, path, parameters) {
  parameters = parameters || {};

  var requestURI = path;
  if(!pathSpec.parameters || !pathSpec.parameters.length) {
    return requestURI;
  }
  pathSpec.parameters.forEach(function(param) {
    //check for existance of required parameters
    if(!Object.keys(parameters).length || parameters[param.name] === undefined && param.required) {
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

function middleware(swaggerDef, options, next) {
  if(!swaggerDef.paths[this._url]) {
    throw new Error('Swagger spec does not define path: ' + this._url);
  }
  if(!options.method) {
    throw new Error('Options must specify a request method(get, post, delete, etc)');
  }
  var method = options.method.toLowerCase();
  if(!swaggerDef.paths[this._url][method]) {
    throw new Error('Swagger spec does not define method: "' + method + '".  Available paths: ' + Object.keys(swaggerDef.paths[this._url]).join(","));
  }
  var pathSpec = swaggerDef.paths[this._url][method];

  //todo validate the response using json-schema
  //default to json
  //if(!pathSpec.consumes || pathSpec.consumes.includes('application/json')) {
  //  //todo - set request options for this.json();
  //}

  options.url = handleParameters(pathSpec, options.url, this.swaggerParams);
  next(options);
}

module.exports = function(app, swaggerDef) {
  var hip = hippie(app);

  hip.use(middleware.bind(hip, swaggerDef));

  return hip;
}