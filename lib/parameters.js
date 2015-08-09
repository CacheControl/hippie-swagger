'use strict';

var skeemas = require('skeemas');

module.exports = function parameters(pathSpec, path, parameters) {
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