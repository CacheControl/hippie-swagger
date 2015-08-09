'use strict';

var hippie = require('../index'),
    app = require('./support/server');

describe('hippie-swagger', function() {
  describe('url parameters', function() {
    it('works with parameter-less urls', function(done) {
      hippie(app, dereferencedSwaggerSchema)
      .get('/foos')
      .end(done);
    });

    it('replaces parameters in urls with provided variables', function(done) {
      hippie(app, dereferencedSwaggerSchema)
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
        hippie(app, dereferencedSwaggerSchema)
        .get('/bars')
        .end()
      }).throw(/Swagger spec does not define path/);
    });

    it('errors if the path method is not specified in the swagger file', function() {
      expect(function() {
        hippie(app, dereferencedSwaggerSchema)
        .url('/foos')
        .method('/foos')
        .end()
      }).throw(/Swagger spec does not define method/);
    });
  });
});