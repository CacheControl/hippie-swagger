'use strict'

var ajv = require('ajv')()
var settings = require('./settings')
var qs = require('qs')
var validateNoExtraParams = require('./extra-parameters')
var objectAssign = require('object-assign')

/**
 * Traverses hippie options, building out a hash of swagger parameters
 * organized by parameter location(body, header, query, etc)
 *
 * @param  {Hash} params - parameters specified
 * @param  {Hash} opts - hippie options
 * @return {Hash} parameters by location
 */
function paramHashFromHippie (pathParams, opts) {
  var params = objectAssign({}, pathParams)
  if (opts.headers) {
    params.header = objectAssign({}, opts.headers)
  }

  // manage body
  if (opts.headers && opts.headers['Content-Type']) {
    if (opts.headers['Content-Type'].match(/application\/x-www-form-urlencoded/)) {
      params.formData = qs.parse(opts.body)
    } else if (opts.headers['Content-Type'].match(/multipart\/form-data/)) {
      params.multipartFormData = opts.body
    }
  }
  if (opts.body && !params.formData && !params.multipartFormData) {
    params.body = opts.body
  }

  if (opts.qs) {
    params.query = objectAssign({}, opts.qs)
  }
  return params
}
function throwMissingRequiredParameter (param) {
  throw new Error('Missing required parameter in ' + param.in + ': ' + param.name)
}

/**
 * Hippie middleware that validates parameters prior to request
 * @param  {Object} pathSpec - swagger path definition
 * @param  {Object} options - hippie-provided hash describing the request about to be made
 * @param  {Object} parameters - hash of path parameters, added via pathParams()
 */
module.exports = function parameters (pathSpec, options, pathParams) {
  /**
   * Replaces variables mentioned in the request uri with what was specified by pathParams()
   * @param  {Any} param - parameter to inject into the uri
   */
  function replacePathParams (param, requestParams) {
    if (param.in === 'path') {
      var regex = new RegExp('{' + param.name + '}', 'g')
      options.url = options.url.replace(regex, requestParams[param.in][param.name])
    }
  }

  /**
   * Validates that any parameter marked as 'required' in the swagger spec was present
   * in the request
   * @param  {Any} param - parameter to assert
   */
  function validateRequiredParams (param, requestParams) {
    if (param.required) {
      if (param.in === 'body') { // There can only be one body parameter, and naming is irrelevant
        if (!requestParams[param.in]) throwMissingRequiredParameter(param)
      } else if (requestParams[param.in] === undefined ||
                 requestParams[param.in][param.name] === undefined) {
        throwMissingRequiredParameter(param)
      }
    }
  }

  /**
   * Validates each parameter against the swagger definition
   * @param  {Any} param - request parameter to be validated
   */
  function validateParamSchema (param, requestParams) {
    if (settings.get('validateParameterSchema') === false) return
    if (!requestParams[param.in]) return

    var paramSchema = objectAssign({}, param)
    var paramValue

    if (paramSchema.in === 'body') {
      paramSchema = paramSchema.schema // "body" params are nested under schema
      paramValue = JSON.parse(requestParams[param.in])
    } else {
      paramValue = requestParams[param.in][param.name]
      if (!paramValue) return

      // delete all the non-json-schema(swagger specific) properties, which will cause an invalid schema
      delete paramSchema.in
      delete paramSchema.description
      delete paramSchema.required
      delete paramSchema.name
    }

    if (!ajv.validate(paramSchema, paramValue)) {
      throw new Error('Invalid format for parameter {' + param.name + '}, received: ' + requestParams[param.in][param.name] + '.  errors:' + ajv.errorsText())
    }
  }
  var requestParams = paramHashFromHippie(pathParams, options)
  pathSpec.parameters = pathSpec.parameters || []

  validateNoExtraParams(pathSpec, requestParams)

  pathSpec.parameters.forEach(function (param) {
    validateRequiredParams(param, requestParams)
    validateParamSchema(param, requestParams)
    replacePathParams(param, requestParams)
  })
  return options
}
