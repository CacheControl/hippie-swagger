'use strict';

var settings = require('./settings');

/**
 * Traverses the parameters in the request and asserts that all were mentioned
 * in the swagger file.
 *
 * Pass the {errorOnExtraParameters:false) option to disable
 *
 * @param  {Object} pathSpec - swagger path definition
 * @param  {Object} parameters - hash of request parameters
 */
module.exports = function validateNoExtraParams(pathSpec, parameters) {
  if(settings.get('errorOnExtraParameters') === false) return;

  var pathSpecParamHash = pathSpec.parameters.reduce(function(hash, param) {
    hash[param.name] = param;
    return hash;
  }, {});
  Object.keys(parameters).forEach(function(type) {
    if(type == 'header') return; //don't subject header variables to swagger mention
    Object.keys(parameters[type]).forEach(function(param) {
      if(!pathSpecParamHash[param]) {
        throw new Error('Parameter not mentioned in swagger spec: "' + param + '", available params: ' +
          pathSpec.parameters.map(function(p) {
            return p.name;
          }).join(',')
        );
      }
    });
  });
}