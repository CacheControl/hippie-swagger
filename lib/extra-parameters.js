'use strict';

var settings = require('./settings'),
    qs = require('qs');

/**
 * Traverses the parameters in the request and asserts that all were mentioned
 * in the swagger file.
 *
 * Pass the {errorOnExtraParameters:false) option to disable
 *
 * @param  {Object} pathSpec - swagger path definition
 * @param  {Object} requestParams - hash of request parameters
 */
module.exports = function validateNoExtraParams(pathSpec, requestParams) {
  if(settings.get('errorOnExtraParameters') === false) return;

  function throwParamNotFound(param) {
    throw new Error('Parameter not mentioned in swagger spec: "' + param + '", available params: ' +
      pathSpec.parameters.map(function(p) {
        return p.name;
      }).join(',')
    );
  }

  var pathSpecParamHash = pathSpec.parameters.reduce(function(hash, param) {
    hash[param.name] = param;
    return hash;
  }, {});
  for(var type in requestParams) {
    if(type == 'header' && settings.get('errorOnExtraHeaderParameters') === false) continue;

    for(var param in requestParams[type]) {
      if(['body', 'formData', 'multipartFormData'].indexOf(param) != -1) {
        //in the case of "body", the name superfluous & since there can only be one,
        //it just needs to mentioned anywhere in the swagger file
        var found = false;
        for(var paramName in pathSpecParamHash) {
          if(pathSpecParamHash[paramName].in == 'body') {
            found = true;
            break;
          }
          if(pathSpecParamHash[paramName].in == 'formData') {
            if(pathSpecParamHash[paramName].type == 'file') {
              var regex = new RegExp('name=\\\\"'+pathSpecParamHash[paramName].name+'\\\\"');
              if(requestParams.multipartFormData.body.match(regex)) {
                found = true;
                break;
              }
            } else if(requestParams.formData.hasOwnProperty(paramName)) {
              found = true;
              break;
            }
          }
        };
        if(!found) throwParamNotFound(param);
      } else if(!pathSpecParamHash[param]) {
        throwParamNotFound(param);
      }
    };
  };
}