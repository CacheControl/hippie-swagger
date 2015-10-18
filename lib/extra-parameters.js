'use strict';

var settings = require('./settings'),
    qs = require('qs'),
    throwParamNotFound;

/**
 * Body/FormData/MultipartFormData handling
 *
 * "body", the parameter name is superfluous since there can only be one.
 * "body" is mutually exclusive with formData/multipartFormData
 *
 * @param  {Object} requestParams     - { formData: hash, body: string }
 * @param  {Object} pathSpecParamHash - subset of swagger file for this path
 * @return {Boolean} found - true when variable mentioned in file, false if unmentioned
 */
function handleBody(requestParams, specParamsByType) {
  return specParamsByType.body !== undefined;
}

function handleFormData(requestFormData, specParamsByType) {
  for(var qsKey in requestFormData) {
    var found = false;
    specParamsByType.formData.forEach(function(formSpecParameter) {

      if(formSpecParameter.name == qsKey && formSpecParameter.type !== 'file') {
        found = true;
      }
    })
    if(!found) {
      throwParamNotFound(qsKey);
    }
  }
}

function handleMultipartFormData(requestFormData, specParamsByType) {
  var found = false;
  specParamsByType.formData.forEach(function(formSpecParameter) {
    if(formSpecParameter.type == 'file') {
      var regex = new RegExp('name=\\\\"'+formSpecParameter.name+'\\\\"');
      if(requestFormData.body.match(regex)) {
        found = true;
      }
    }
  });
  if(!found) {
    throwParamNotFound(requestFormData.requestParams.multipartFormData.body);
  }
}

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

  throwParamNotFound = function(param) {
    throw new Error('Parameter not mentioned in swagger spec: "' + param + '", available params: ' +
      pathSpec.parameters.map(function(p) {
        return p.name;
      }).join(',')
    );
  }

  var specParamsByName = pathSpec.parameters.reduce(function(hash, param) {
    hash[param.name] = param;
    return hash;
  }, {});
  var specParamsByType = pathSpec.parameters.reduce(function(hash, param) {
    if(!hash[param.in]) hash[param.in] = [];
    hash[param.in].push(param);
    return hash;
  }, {});
  for(var type in requestParams) {
    var parameterInSwagger;
    if(type == 'header' && settings.get('errorOnExtraHeaderParameters') === false) continue;
    switch(type) {
      case 'body':
        parameterInSwagger = handleBody(requestParams, specParamsByType);
        if(!parameterInSwagger) throwParamNotFound(requestParams[type]);
        break;
      case 'formData':
        handleFormData(requestParams.formData, specParamsByType);
        break
      case 'multipartFormData':
        handleMultipartFormData(requestParams.multipartFormData, specParamsByType);
        break;
      default:
        for(var param in requestParams[type]) {
          if(specParamsByName[param] === undefined) {
            throwParamNotFound(param);
          }
        }
    };
  };
};