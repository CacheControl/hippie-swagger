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
 * @param  {Object} requestBody
 * @param  {Object} pathSpecParamHash - subset of swagger file for this path
 * @return {Boolean} found - true when variable mentioned in file, false if unmentioned
 */
function handleBody(requestBody, specParamsByType) {
  if(requestBody && specParamsByType.body === undefined) {
    throw new Error('Request "body" present, but Swagger spec has no body parameter mentioned')
  };
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

function handleMultipartFormData(multipartFormData, specParamsByType) {
  var found = false;
  specParamsByType.formData.forEach(function(formSpecParameter) {
    if(formSpecParameter.type == 'file') {
      var regex = new RegExp('name=\\\\"'+formSpecParameter.name+'\\\\"');
      if(!multipartFormData || multipartFormData.match(regex)) {
        found = true;
      }
    }
  });
  if(!found) {
    throwParamNotFound(multipartFormData);
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

  var specParamsByName = {}, specParamsByType = {};
  pathSpec.parameters.forEach(function(param) {
    if(!specParamsByType[param.in]) specParamsByType[param.in] = [];
    specParamsByType[param.in].push(param);
    specParamsByName[param.name] = param;
  }, {});

  for(var type in requestParams) {
    var parameterInSwagger;
    if(type == 'header' && settings.get('errorOnExtraHeaderParameters') === false) continue;
    switch(type) {
      case 'body':
        handleBody(requestParams.body, specParamsByType);
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