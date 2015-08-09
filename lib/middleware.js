'use strict';

var skeemas = require('skeemas'),
    parameters = require('./parameters.js'),
    response = require('./response.js');

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
  this.expect(response.bind(this, pathSpec));

  options.url = parameters(pathSpec, options.url, this.swaggerParams);
  next(options);
};

module.exports = middleware;