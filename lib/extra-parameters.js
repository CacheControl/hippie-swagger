'use strict';

var settings = require('./settings');

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
    if(type == 'header' && settings.get('errorOnExtraHeaderParameters') === false) return;

    for(var param in requestParams[type]) {
      if(param == 'body') {
        //in the case of "body", the name superfluous & since there can only be one,
        //it just needs to mentioned anywhere in the swagger file
        var found = false;
        for(var prop in pathSpecParamHash) {
          if(pathSpecParamHash[prop].in == 'body') {
            found = true;
            break;
          }
        };
        if(!found) throwParamNotFound(param);
      } else if(!pathSpecParamHash[param]) {
        throwParamNotFound(param);
      }
    };
  };
}