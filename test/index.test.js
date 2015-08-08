'use strict';

var test = require('tape-catch'),
    swaggerSpec = require('./swagger.js'),
    hippie = require('../index'),
    expect = require('chai').expect,
    swaggerParser = require('swagger-parser'),
    app = require('./support/server');

describe('hippie-swagger', function() {
  var schema;
  beforeEach(function(done) {
    swaggerParser.parse(swaggerSpec, function(err, api, metadata) {
      if(err) done(err);
      schema = api;
      done();
    });
  });

  describe('url parameters', function() {
    it('works with parameter-less urls', function(done) {
      hippie(app, schema)
      .get('/foos')
      .end(done);
    });

    it('replaces parameters in urls with provided variables', function(done) {
      hippie(app, schema)
      .get('/foos/{fooId}')
      .params({ fooId:data.firstFoo.id })
      .end(function(err, res) {
        expect(err).to.be.undefined;
        expect(res.req.path).to.equal('/foos/' + data.firstFoo.id);
        done();
      });
    });
  });

  describe('path validation', function() {
    it('errors if the path does not exist in the swagger file', function() {
      expect(function() {
        hippie(app, schema)
        .get('/bars')
        .end()
      }).throw(/Swagger spec does not define path/);
    });

    it('errors if the path method is not specified in the swagger file', function() {
      expect(function() {
        hippie(app, schema)
        .url('/foos')
        .method('/foos')
        .end()
      }).throw(/Swagger spec does not define method/);
    });
  });
});