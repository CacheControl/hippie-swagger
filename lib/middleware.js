'use strict'

var parameterize = require('./parameters.js')
var url = require('url')
var response = require('./response.js')
require('string.prototype.startswith')

function middleware (swaggerDef, options, next) {
  var parsedUrl = url.parse(this._url)
  var path = decodeURI(parsedUrl.pathname)

  // handle basePath if set and different from /
  if (swaggerDef.basePath && swaggerDef.basePath !== '/') {
    if (!path.startsWith(swaggerDef.basePath)) {
      throw new Error('Swagger spec does not define path: ' + this._url)
    }

    // remove basePath before searching path into swagger paths
    path = path.replace(swaggerDef.basePath, '')
    path = path === '' ? '/' : path
  }

  if (!swaggerDef.paths[path]) {
    throw new Error('Swagger spec does not define path: ' + this._url)
  }
  if (!options.method) {
    throw new Error('No request method provided(get, post, delete, etc)')
  }
  var method = options.method.toLowerCase()
  var pathSpec = swaggerDef.paths[path][method]

  // inspect the base path for any params that should be used by all sibling operations
  var pathSpecShared = swaggerDef.paths[path]['parameters']
  if (pathSpecShared != undefined) {
     pathSpec.parameters = (pathSpec.parameters == undefined) ? pathSpecShared : pathSpec.parameters.concat(pathSpecShared)
  }

  if (!pathSpec) {
    throw new Error('Swagger spec does not define method: "' + method + '" in path ' + path + '.  Available methods: ' + Object.keys(swaggerDef.paths[path]).join(','))
  }
  // add expect callback to validate response against json-schema
  this.expect(response.bind(this, pathSpec))

  // replace {variables} in the url with whatever was specified by params()
  options = parameterize(pathSpec, options, this.swaggerParams)
  next(options)
}

module.exports = middleware
