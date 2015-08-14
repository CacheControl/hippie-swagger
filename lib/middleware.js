'use strict';

var skeemas = require('skeemas'),
    parameterize = require('./parameters.js'),
    url = require('url'),
    response = require('./response.js');

function middleware(swaggerDef, options, next) {
  var parsedUrl = url.parse(this._url);
  if(!swaggerDef.paths[parsedUrl.pathname]) {
    throw new Error('Swagger spec does not define path: ' + this._url);
  }
  if(!options.method) {
    throw new Error('No request method provided(get, post, delete, etc)');
  }
  var method = options.method.toLowerCase(),
      pathSpec = swaggerDef.paths[parsedUrl.pathname][method];
  if(!pathSpec) {
    throw new Error('Swagger spec does not define method: "' + method + '" in path ' + parsedUrl.pathname + '.  Available methods: ' + Object.keys(swaggerDef.paths[parsedUrl.pathname]).join(","));
  }
  //add expect callback to validate response against json-schema
  this.expect(response.bind(this, pathSpec));

  //replace {variables} in the url with whatever was specified by params()
  options = parameterize(pathSpec, options, this.swaggerParams);
  next(options);
};

module.exports = middleware;