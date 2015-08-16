'use strict';

describe('url parameters', function() {
  it('ignores optional parameters that are missing', function(done) {
    hippie(app, swaggerSchema)
    .get('/foos')
    .end(done);
  });

  it('errors if a required parameter is missing', function() {
    expect(function() {
      hippie(app, swaggerSchema)
      .get('/foos/{fooId}')
      .end();
    }).to.throw(/Missing required parameter in path: fooId/);
  });

  it('replaces parameters in urls with provided variables', function(done) {
    hippie(app, swaggerSchema)
    .get('/foos/{fooId}')
    .pathParams({ fooId:data.firstFoo.id })
    .end(function(err, res) {
      expect(err).to.be.undefined;
      expect(res.req.path).to.equal('/foos/' + data.firstFoo.id);
      done();
    });
  });

  it('errors if the parameter fails json-schema validation', function() {
    expect(function() {
      hippie(app, swaggerSchema)
      .get('/foos/{fooId}')
      .pathParams({ fooId:45 })
      .end()
    }).to.throw(/Invalid format for parameter {fooId}/);
  });

  it('replaces query string variables', function(done) {
    var limit = 10, offset = 2;

    hippie(app, swaggerSchema)
    .get('/foos?limit={limit}&offset={offset}')
    .queryParams({ limit:limit, offset:offset })
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

  //todo - rename path variables tests to align with below
  it('only replaces queryParams in the querystring');
  it('only replaces bodyParams in the post body');
  it('only replaces headerParams in the header');
  it('replaces body variables');
  it('errors if extra parameters are provided which are not mentioned in the swagger spec', function() {
    expect(function() {
      hippie(app, swaggerSchema)
      .get('/foos')
      .pathParams({ asdf: 50 })
      .end();
    }).to.throw(/Parameter not mentioned in swagger spec: "asdf"/);
  });
  it('errors if a parameter is not provided');
});