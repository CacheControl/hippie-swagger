'use strict';

var hippie = require('hippie'),
    middleware = require('./middleware'),
    swaggerValidator = require('./swagger-validator');

//@TODOs
//add test coverage in response.js
// bodyParams?
  //" Since form parameters are sent in the payload, they cannot be declared together with a body parameter for the same operation."
//"in": "formData"
hippie.prototype._setParam = function(parameters, type) {
  var self = this;
  this.swaggerParams = this.swaggerParams || {};
  this.swaggerParams[type] = this.swaggerParams[type] || {};
  Object.keys(parameters).forEach(function(key) {
    self.swaggerParams[type][key] = parameters[key];
  });
  return this;
};

hippie.prototype.pathParams = function(parameters) {
  this._setParam(parameters, 'path');
  return this;
};

module.exports = function(app, swaggerDef) {
  swaggerValidator(swaggerDef);

  var hip = hippie(app);
  hip.json();
  hip.use(middleware.bind(hip, swaggerDef));
  return hip;
};