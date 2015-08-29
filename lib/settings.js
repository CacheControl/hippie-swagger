'use strict';

var settings = settingsWithDefaults();

/**
 * Retrieves the default hippie-swagger settings, honoring overrides
 * @param  {Object} overrides - user specified overrides
 * @return {Object} user settings w/included defaults
 */
function settingsWithDefaults(overrides) {
  var opts = overrides || {};
  if(opts.validateResponse === undefined) {
    opts.validateResponse = true;
  }
  if(opts.validateParameterSchema === undefined) {
    opts.validateParameterSchema = true;
  }
  if(opts.errorOnExtraParameters === undefined) {
    opts.errorOnExtraParameters = true;
  }
  return opts;
}

module.exports = {
  get: function(key) {
    return settings[key];
  },
  store: function(data) {
    settings = settingsWithDefaults(data);
  }
}