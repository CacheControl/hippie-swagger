'use strict';

var hippie = require('hippie'),
    middleware = require('./middleware');

hippie.prototype.params = function(parameters) {
  var self = this;
  this.swaggerParams = this.swaggerParams || {};
  Object.keys(parameters).forEach(function(k) {
    self.swaggerParams[k] = parameters[k];
  });
  return this;
};

module.exports = function(app, swaggerDef) {
  var hip = hippie(app);
  hip.json();
  hip.use(middleware.bind(hip, swaggerDef));
  return hip;
}