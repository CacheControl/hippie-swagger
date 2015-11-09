'use strict'

var objectAssign = require('object-assign')

var settings = {}
var defaults = {
  validateResponseSchema: true,
  validateParameterSchema: true,
  errorOnExtraParameters: true,
  errorOnExtraHeaderParameters: false
}

/**
 * Retrieves the default hippie-swagger settings, honoring overrides
 * @param  {Object} overrides - user specified overrides
 * @return {Object} settings w/applied defaults
 */
function settingsWithDefaults (overrides) {
  var opts = overrides || {}
  return objectAssign({}, defaults, opts)
}

module.exports = {
  get: function (key) {
    return settings[key]
  },
  store: function (data) {
    settings = settingsWithDefaults(data)
  }
}
