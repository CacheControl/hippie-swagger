'use strict';

describe('GET requests', function() {
  it('works when valid', function() {
    hippie(app, swaggerSchema)
    .get('/foos/{fooId}')
    .pathParams({ fooId:data.firstFoo.id })
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