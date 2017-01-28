'use strict'

/**
 * Example for demonstrating hippie-swagger usage, including dereferencing
 *
 * Usage:  mocha example/index.js
 */

var SwaggerParser = require('swagger-parser')
var parser = new SwaggerParser()
var hippie = require('..')
var app = require('./server')
var expect = require('chai').expect
var path = require('path')
var dereferencedSwagger

describe('Example of', function () {
  before(function (done) {
    // if using mocha, dereferencing can be performed prior during initialization via the delay flag:
    // https://mochajs.org/#delayed-root-suite
    parser.dereference(path.join(__dirname, './api.swagger.json'), function (err, api) {
      if (err) return done(err)
      dereferencedSwagger = api
      done()
    })
  })

  describe('correct usage', function () {
    it('works when the request matches the swagger file', function (done) {
      hippie(app, dereferencedSwagger)
        .get('/tags/{tagId}')
        .pathParams({
          tagId: 1
        })
        .expectStatus(200)
        .expectValue('[0].id', 1)
        .expectValue('[0].name', 'user')
        .expectValue('[1].id', 2)
        .expectValue('[1].name', 'store')
        .end(done)
    })
  })

  describe('things hippie-swagger will punish you for:', function () {
    it('validates paths', function (done) {
      try {
        hippie(app, dereferencedSwagger)
          .get('/undocumented-endpoint')
          .end()
      } catch (ex) {
        expect(ex.message).to.equal('Swagger spec does not define path: /undocumented-endpoint')
        done()
      }
    })

    it('validates parameters', function (done) {
      try {
        hippie(app, dereferencedSwagger)
          .get('/tags/{tagId}')
          .qs({ username: 'not-in-swagger' })
          .end()
      } catch (ex) {
        expect(ex.message).to.equal('query parameter not mentioned in swagger spec: "username", available params: tagId')
        done()
      }
    })

    it('validates responses', function (done) {
      hippie(app, dereferencedSwagger)
        .get('/tags/invalidResponse')
        .end(function (err) {
          expect(err.message).to.match(/Response failed validation/)
          done()
        })
    })

    it('validates many other things!  See README for the complete list of validations.')
  })
})
