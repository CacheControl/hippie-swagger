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
  if (!pathSpec) {
    throw new Error('Swagger spec does not define method: "' + method + '" in path ' + path + '.  Available methods: ' + Object.keys(swaggerDef.paths[path]).join(','))
  }

  pathSpec.parameters = pathSpec.parameters ? pathSpec.parameters.slice() : []
  var pathParameters = swaggerDef.paths[path].parameters || []

  // iterate over the path parameters (the defaults), and append any that were not
  // overridden within the method definition
  pathParameters.forEach(function (pathLevelParam) {
    var addDefaultParam = true
    for (var i = 0; i < pathSpec.parameters.length; i++) {
      var methodLevelParam = pathSpec.parameters[i]
      if (methodLevelParam.name === pathLevelParam.name) {
        addDefaultParam = false
        break
      }
    }
    if (addDefaultParam) pathSpec.parameters.push(pathLevelParam)
  })

  // add expect callback to validate response against json-schema
  this.expect(response.bind(this, pathSpec))

  // replace {variables} in the url with whatever was specified by params()
  options = parameterize(pathSpec, options, this.swaggerParams)
  next(options)
}

module.exports = middleware
