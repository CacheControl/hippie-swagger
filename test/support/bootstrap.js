'use strict'

var swaggerParser = require('swagger-parser')
var swaggerSpec = require('./swagger.js')
var chai = require('chai')
var chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

global.expect = chai.expect
global.data = require('./data')
global.app = require('./server')
global.hippie = require('../../index')
global.cloneSwagger = function (swagger) {
  return JSON.parse(JSON.stringify(swagger))
}

swaggerParser.dereference(swaggerSpec, function (err, api, metadata) {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  global.swaggerSchema = api
  run(err)
})
