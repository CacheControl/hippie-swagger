/*
 * Provides a list of swagger formats that are not part of the json-schema specification
 * Allows json-schema parses like ajv to explicitly ignore formats
 */
module.exports = [
  'int32',
  'int64',
  'float',
  'double',
  'byte',
  'binary',
  'date',
  'password'
]
