'use strict'

/**
 * Determines if object is a swagger definition, raising errors if invalid
 * @param  {Object} swaggerDef
 */
function validateSwagger (swaggerDef) {
  if (!swaggerDef) {
    throw new Error('Swagger schema required')
  }
  if (!isSwagger(swaggerDef)) {
    throw new Error('Swagger schema invalid')
  }
}

/**
 * Poor man's swagger validator.  Does some basic validation on the existence of the schema itself and
 * root level keys.  Provides basic validations, meant to catch wrong params types.
 * Not meant as a substitute for swagger-parser (https://github.com/BigstickCarpet/swagger-parser)
 *
 * @param  {Object} swaggerDef - dereferrenced swagger object
 */
function isSwagger (obj) {
  var requiredKeys = ['swagger', 'info', 'paths']
  return requiredKeys.every(function (key) {
    return obj.hasOwnProperty(key)
  })
}

module.exports = {
  validateSwagger: validateSwagger,
  isSwagger: isSwagger
}
