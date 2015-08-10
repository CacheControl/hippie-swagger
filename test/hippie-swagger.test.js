'use strict';

var hippie = require('../index'),
    app = require('./support/server');

describe('hippie-swagger', function() {
  describe('url parameters', function() {
    it('works with parameter-less urls', function(done) {
      hippie(app, swaggerSchema)
      .get('/foos')
      .end(done);
    });

    it('replaces parameters in urls with provided variables', function(done) {
      hippie(app, swaggerSchema)
      .get('/foos/{fooId}')
      .params({ fooId:data.firstFoo.id })
      .end(function(err, res) {
        expect(err).to.be.undefined;
        expect(res.req.path).to.equal('/foos/' + data.firstFoo.id);
        done();
      });
    });
  });

  describe('response validation with swagger json-schema', function() {
    describe('GET requests', function() {
      it('works when valid', function() {
        hippie(app, swaggerSchema)
        .get('/foos/{fooId}')
        .params({ fooId:data.firstFoo.id })
        .end(function(err, res) {
          expect(err).to.be.undefined;
          done();
        });
      });

      it('errors when the response is invalid', function(done) {
        hippie(app, swaggerSchema)
        .get('/invalid-foos')
        .end(function(err) {
          expect(err.message).to.match(/Response from \/invalid-foos failed validation/)
          done();
        });
      });
    });
  });
});
