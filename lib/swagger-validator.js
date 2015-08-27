'use strict';

var requiredKeys = ['swagger', 'info', 'paths'];
/**
 * Poor man's swagger validator.  Does some basic validation on the existence of the schema itself and
 * root level keys.  Provides basic validations, meant to catch wrong params types.
 * Not meant as a substitute for swagger-parser (https://github.com/BigstickCarpet/swagger-parser)
 *
 * @param  {Object} swaggerDef - dereferrenced swagger object
 */
module.exports = function validateSwagger(swaggerDef) {
  if(!swaggerDef) {
    throw new Error('Swagger schema required');
  }
  requiredKeys.forEach(function(key){
    if(!swaggerDef[key]) {
      throw new Error('Swagger schema missing required property: "' + key + '"');
    }
  });
}