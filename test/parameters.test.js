'use strict';

describe('url parameters', function() {
  it('ignores optional parameters that are missing', function(done) {
    hippie(app, swaggerSchema)
    .get('/foos')
    .end(done);
  });

  it('replaces path parameters with provided variables', function(done) {
    hippie(app, swaggerSchema)
    .get('/foos/{fooId}')
    .pathParams({ fooId:data.firstFoo.id })
    .end(function(err, res) {
      expect(err).to.be.undefined;
      expect(res.req.path).to.equal('/foos/' + data.firstFoo.id);
      done();
    });
  });

  it('replaces query string variables', function(done) {
    var limit = 10, offset = 2;

    hippie(app, swaggerSchema)
    .get('/foos')
    .qs({ limit:limit, offset:offset })
    .end(function(err, res) {
      expect(err).to.be.undefined;
      expect(res.req.path).to.equal('/foos?limit=' + limit + '&offset=' + offset);
      done();
    });
  });

  describe('header variables', function() {
    it('errors if the header is required', function() {
      var objectAssign = require('object-assign'),
          headerSchema = objectAssign({}, swaggerSchema);

      //set X-Total-Count to be required for this test
      headerSchema["paths"]["/foos"]["get"]["parameters"].filter(function(param) {
        return param.name == 'X-Total-Count';
      })[0]["required"] = true;

      expect(function() {
        hippie(app, headerSchema)
        .get('/foos')
        .end();
      }).to.throw(/Missing required parameter in header: X-Total-Count/)
    });

    it('replaces header variables', function(done) {
      hippie(app, swaggerSchema)
      .get('/foos')
      .header("X-Total-Count", 1)
      .end(function(err, res) {
        expect(err).to.be.undefined;
        expect(res.request.headers["X-Total-Count"]).to.exist;
        expect(res.request.headers["X-Total-Count"]).to.equal(1);
        done();
      });
    });
  });

  describe('errors', function() {
    it('when a required parameter is missing', function() {
      expect(function() {
        hippie(app, swaggerSchema)
        .get('/foos/{fooId}')
        .end();
      }).to.throw(/Missing required parameter in path: fooId/);
    });

    it('when a parameter fails json-schema validation', function() {
      expect(function() {
        hippie(app, swaggerSchema)
        .get('/foos/{fooId}')
        .pathParams({ fooId:45 })
        .end()
      }).to.throw(/Invalid format for parameter {fooId}/);
    });
  });

  describe('settings', function() {
    it('when validateParameterSchema is off, it does not error if parameter fails json-schema validation', function() {
      expect(function() {
        hippie(app, swaggerSchema, { validateParameterSchema:false })
        .get('/foos/{fooId}')
        .pathParams({ fooId:45 })
        .end()
      }).to.not.throw();
    });
  });
});