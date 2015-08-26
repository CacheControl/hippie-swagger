'use strict';

var requiredKeys = ['swagger', 'info', 'paths'];
/*
 * Poor man's swagger validator.  Does some basic validation on the root level keys and
 * existence of the schema itself.  Not meant to be a substitute for swagger-parser
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