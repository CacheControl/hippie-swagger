'use strict';

var hippie = require('hippie'),
    middleware = require('./middleware'),
    settings = require('./settings'),
    swaggerValidator = require('./swagger-validator');

//@TODOs
//"in": "formData"
  //" Since form parameters are sent in the payload, they cannot be declared together with a body parameter for the same operation."

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