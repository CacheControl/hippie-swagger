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
      throw new Error('Missing required parameter: ' + param.name + '.  Did you forget to call "params({' + param.name + ': value})"?');
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
  this.expect(validateResponse.bind(this, pathSpec));

  options.url = handleParameters(pathSpec, options.url, this.swaggerParams);
  next(options);
}

function validateResponse(pathSpec, res, body, next) {
  var schema = pathSpec.responses['200'].schema,
      result = skeemas.validate(body, schema);

  if(!result.valid) return next(new Error('Response failed validation against schema (' + schema + '): ' + result.errors[0]));

  next();
};

module.exports = function(app, swaggerDef) {
  var hip = hippie(app);
  hip.json();
  hip.use(middleware.bind(hip, swaggerDef));
  return hip;
}