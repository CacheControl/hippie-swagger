'use strict';

var ajv = require('ajv')(),
    settings = require('./settings'),
    validateNoExtraParams = require('./extra-parameters'),
    objectAssign = require('object-assign');

/**
 * Hippie middleware that validates parameters prior to request
 * @param  {Object} pathSpec - swagger path definition
 * @param  {Object} options - hippie-provided hash describing the request about to be made
 * @param  {Object} parameters - hash of request parameters
 */
module.exports = function parameters(pathSpec, options, parameters) {
  /**
   * Replaces variables mentioned in the request uri with what was specified by pathParams()
   * @param  {Any} param - parameter to inject into the uri
   */
  function replacePathParams(param) {
    if(param.in == 'path') {
      var regex = new RegExp('{' + param.name + '}', 'g');
      options.url = options.url.replace(regex, parameters[param.in][param.name]);
    }
  }

  /**
   * Validates that any parameter marked as 'required' in the swagger spec was present
   * in the request
   * @param  {Any} param - parameter to assert
   */
  function validateRequiredParams(param) {
    if((parameters[param.in] === undefined ||
       parameters[param.in][param.name] === undefined) && param.required) {
        throw new Error('Missing required parameter in ' + param.in + ': ' + param.name);
    }
  }

  /**
   * Validates each parameter against the swagger definition
   * @param  {Any} param - request parameter to be validated
   */
  function validateParamSchema(param) {
    if(settings.get('validateParameterSchema') === false) return;

    if(!parameters[param.in] || !parameters[param.in][param.name]) return;

    var paramSchema = objectAssign({}, param),
        paramValue = parameters[param.in][param.name];

    if(paramSchema.in === 'body') {
      //"body" params are nested under schema
      paramSchema = paramSchema.schema;
      paramValue = JSON.parse(paramValue);
    } else {
      //delete all the non-json-schema(swagger specific) properties, which will cause an invalid schema
      delete paramSchema.in;
      delete paramSchema.description;
      delete paramSchema.required;
      delete paramSchema.name;
    }

    if(!ajv.validate(paramSchema, paramValue)) {
      throw new Error('Invalid format for parameter {' + param.name + '}, received: ' + parameters[param.in][param.name] + '.  errors:' + ajv.errorsText());
    }
  }
  parameters = parameters || {};
  pathSpec.parameters = pathSpec.parameters || [];

  if(options.body) {
    parameters.body = { body: options.body };
  }
  if(options.headers) {
    parameters.header = objectAssign({}, options.headers);
  }
  if(options.qs) {
    parameters.query = objectAssign({}, options.qs);
  }

  validateNoExtraParams(pathSpec, parameters);

  pathSpec.parameters.forEach(function(param) {
    validateRequiredParams(param);
    validateParamSchema(param);
    replacePathParams(param);
  });
  return options;
}