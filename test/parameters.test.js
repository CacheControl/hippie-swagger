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
    }).to.throw(/Missing required parameter: fooId/);
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

  it('errors if the parameter fails json-schema validation', function() {
    expect(function() {
      hippie(app, swaggerSchema)
      .get('/foos/{fooId}')
      .params({ fooId:45 })
      .end()
    }).to.throw(/Invalid format for parameter {fooId}/);
  });

  it('replaces query string variables', function(done) {
    var limit = 10, offset = 2;

    hippie(app, swaggerSchema)
    .get('/foos?limit={limit}&offset={offset}')
    .params({ limit:limit, offset:offset })
    .end(function(err, res) {
      expect(err).to.be.undefined;
      expect(res.req.path).to.equal('/foos?limit=' + limit + '&offset=' + offset);
      done();
    });
  });

  it('replaces header variables', function() {

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
      .params({ asdf: 50 })
      .end();
    }).to.throw(/Parameter not mentioned in swagger spec: "asdf"/);
  });
  it('errors if a parameter is not provided');
});