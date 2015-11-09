'use strict'

var settings = require('./settings')
var throwParamNotFound

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
function handleBody (requestBody, specBody) {
  if (requestBody && specBody === undefined) {
    throw new Error('Request "body" present, but Swagger spec has no body parameter mentioned')
  }
}

/**
 * Asserts that request form data variables are in Swagger. Throws if not found.
 * @param  {Object} requestFormData - request form data(query string format) as a hash
 * @param  {Object} requestParams - hash of request parameters
 */
function handleFormData (requestFormData, specFormData) {
  for (var qsKey in requestFormData) {
    var found = false
    specFormData.forEach(function (formSpecParameter) {
      if (formSpecParameter.name === qsKey && formSpecParameter.type !== 'file') {
        found = true
      }
    })
    if (!found) {
      throwParamNotFound(qsKey, 'formData')
    }
  }
}

/**
 * Asserts that multipart file uploads are in swagger. Throws if not found.
 * @param  {String} multipartFormData - request body
 * @param  {Object} specParamsByType  - swagger parameters hashed by location
 */
function handleMultipartFormData (multipartFormData, specFormData) {
  var found = false
  specFormData.forEach(function (formSpecParameter) {
    if (formSpecParameter.type === 'file') {
      var regex = new RegExp('name=\\\\"' + formSpecParameter.name + '\\\\"')
      if (!multipartFormData || multipartFormData.match(regex)) {
        found = true
      }
    }
  })
  if (!found) {
    throwParamNotFound(multipartFormData, 'formData (expected type "file")')
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
module.exports = function validateNoExtraParams (pathSpec, requestParams) {
  if (settings.get('errorOnExtraParameters') === false) return

  throwParamNotFound = function (param, location) {
    throw new Error(location + ' parameter not mentioned in swagger spec: "' + param + '", available params: ' +
      pathSpec.parameters.map(function (p) {
        return p.name
      }).join(',')
    )
  }

  var specParamsByName = {}
  var specParamsByType = {}
  pathSpec.parameters.forEach(function (param) {
    if (!specParamsByType[param.in]) specParamsByType[param.in] = []
    specParamsByType[param.in].push(param)
    specParamsByName[param.name] = param
  }, {})

  for (var type in requestParams) {
    if (type === 'header' && settings.get('errorOnExtraHeaderParameters') === false) continue
    switch (type) {
      case 'body':
        handleBody(requestParams.body, specParamsByType.body)
        break
      case 'formData':
        handleFormData(requestParams.formData, specParamsByType.formData)
        break
      case 'multipartFormData':
        handleMultipartFormData(requestParams.multipartFormData, specParamsByType.formData)
        break
      default:
        for (var param in requestParams[type]) {
          if (specParamsByName[param] === undefined) {
            throwParamNotFound(param, type)
          }
        }
    }
  }
}
