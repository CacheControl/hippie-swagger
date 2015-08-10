'use strict';

var skeemas = require('skeemas'),
    parameterize = require('./parameters.js'),
    response = require('./response.js');

function middleware(swaggerDef, options, next) {
  if(!swaggerDef.paths[this._url]) {
    throw new Error('Swagger spec does not define path: ' + this._url);
  }
  if(!options.method) {
    throw new Error('No request method provided(get, post, delete, etc)');
  }
  var method = options.method.toLowerCase();
  if(!swaggerDef.paths[this._url][method]) {
    throw new Error('Swagger spec does not define method: "' + method + '".  Available paths: ' + Object.keys(swaggerDef.paths[this._url]).join(","));
  }
  //add expect callback to validate response against json-schema
  var pathSpec = swaggerDef.paths[this._url][method];
  this.expect(response.bind(this, pathSpec));

  //replace {variables} in the url with whatever was specified by params()
  options = parameterize(pathSpec, options, this.swaggerParams);
  next(options);
};

module.exports = middleware;