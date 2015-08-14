'use strict';

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

  it('errors if the parameter fails json-schema validation', function() {
    expect(function() {
      hippie(app, swaggerSchema)
      .get('/foos/{fooId}')
      .params({ fooId:45 })
      .end()
    }).to.throw(/Invalid format for parameter {fooId}/);
  });


  it('replaces query string variables', function() {
    var limit = 10, offset = 2;

    hippie(app, swaggerSchema)
    .get('/foos?limit={limit}&offset={offset}')
    .params({ limit:limit })
    .end(function(err, res) {
      expect(err).to.be.undefined;
      expect(res.req.path).to.equal('/foos?limit=' + limit + '&offset=' + offset);
      done();
    });
  });

  it('replaces header variables');
  it('replaces body variables');
});