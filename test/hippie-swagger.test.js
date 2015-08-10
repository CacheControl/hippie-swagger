'use strict';

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
    //parameter.test.js
    it('errors if the parameter fails json-schema validation');
    it('replaces query string variables');
    it('replaces header variables');
    it('replaces body variables');
  });

  describe('response validation with swagger json-schema', function() {
    describe('GET requests', function() {
      it('works if no json-schema is provided for the response');
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

    describe('POST requests', function() {
      var validPostBody = {
        id: '241a4d44-5b90-41fa-9454-5aa6568087e4',
        description: 'third foo',
        orderNumber: 3
      };
      it('works when valid', function() {
        hippie(app, swaggerSchema)
        .post('/foos')
        .send(validPostBody)
        .end(function(err, res) {
          expect(err).to.be.undefined;
          done();
        });
      });

      it('errors when the post body is invalid', function(done) {
        expect(function() {
          hippie(app, swaggerSchema)
          .post('/foos')
          .send({
            bogus: 'post-body'
          })
          .end()
        }).to.throw(/Invalid format for parameter/);
        done();
      });

      it('errors when the post response is invalid', function(done) {
          hippie(app, swaggerSchema)
          .post('/invalid-foos')
          .send(validPostBody)
          .end(function(err) {
            expect(err.message).to.match(/Response from \/invalid-foos failed validation/);
            done();
          });
      });
    });
  });
});
