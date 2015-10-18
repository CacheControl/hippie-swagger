'use strict';

var hippie = require('hippie'),
    middleware = require('./middleware'),
    settings = require('./settings'),
    swaggerValidator = require('./swagger-validator');

//@TODOs
//"in": "formData"
  //" Since form parameters are sent in the payload, they cannot be declared together with a body parameter for the same operation."
//Body - The payload that's appended to the HTTP request.
//Since there can only be one payload, there can only be one body parameter.
//The name of the body parameter has no effect on the parameter itself and is used for documentation purposes only.
//Since Form parameters are also in the payload, body and form parameters cannot exist together fo
hippie.prototype.pathParams = function(parameters) {
  var self = this;
  this.swaggerParams = this.swaggerParams || {};
  this.swaggerParams.path = this.swaggerParams.path || {};

  Object.keys(parameters).forEach(function(key) {
    self.swaggerParams.path[key] = parameters[key];
  });
  return this;
};

module.exports = function(app, swaggerDef, overrides) {
  settings.store(overrides);

  swaggerValidator(swaggerDef);

  var api = hippie(app);
  api.json();
  api.use(middleware.bind(api, swaggerDef));

  return api;
};