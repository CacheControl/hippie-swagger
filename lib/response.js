'use strict'

var ajv = require('ajv')()
var settings = require('./settings')

/**
 * Performs json-schema validation using the schema defined in the swagger response
 * against the response body returned from the server.
 *
 * Can be disabled by passing the {validateResponseSchema: false} option
 *
 * @param  {Object} res - response object returned
 * @param  {Object} body - response body
 * @param  {Object} schema - json schema
 */
function validateBody (res, body, schema) {
  if (!body || settings.get('validateResponseSchema') === false) return

  if (schema) {
    if (!ajv.validate(schema, body)) {
      throw new Error('Response from ' + res.request.path + ' failed validation: [' + ajv.errorsText() + ']\n Response:' + JSON.stringify(body))
    }
  } else if (body.length) {
    // From swagger specifications: "If this field(statusCode.schema) does not exist,
    // it means no content is returned as part of the response"
    throw new Error('Received non-empty response from ' + res.request.path + '. Expected empty response body because no "schema" property was specified in swagger path.')
  }
}

/**
 * Throws an exception if the status code received from the
 * server was not specified in the swagger response
 * @param  {Number} statusCode - status code received from response
 */
function validateStatusCode (res, statusCode) {
  if (statusCode === undefined) {
    throw new Error('No mention of statusCode: ' + res.statusCode + ' in ' + res.request.path)
  }
}

module.exports = function response (pathSpec, res, body, next) {
  var statusCode = pathSpec.responses[res.statusCode]
  try {
    validateStatusCode(res, statusCode)
    validateBody(res, body, statusCode.schema)
  } catch (err) {
    return next(err)
  }
  next()
}
