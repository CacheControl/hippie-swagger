'use strict';

var hippie = require('hippie'),
    middleware = require('./middleware');

// bodyParams?
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

hippie.prototype.queryParams = function(parameters) {
  this._setParam(parameters, 'query');
  return this;
};

module.exports = function(app, swaggerDef) {
  var hip = hippie(app);
  hip.json();
  hip.use(middleware.bind(hip, swaggerDef));
  return hip;
};