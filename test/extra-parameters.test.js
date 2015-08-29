'use strict';

describe('extra parameters', function() {
  it('errors on parameters not mentioned in the swagger spec', function() {
    expect(function() {
      hippie(app, swaggerSchema)
      .get('/foos')
      .pathParams({ asdf: 50 })
      .end();
    }).to.throw(/Parameter not mentioned in swagger spec: "asdf"/);
  });

  describe('header parameters', function() {
    it('does not error if the header was not mentioned in swagger', function() {
      expect(function() {
        hippie(app, swaggerSchema)
        .header("X-New-Header", 1)
        .get('/foos')
        .end();
      }).to.not.throw()
    });

    it('errors if the header was not mentioned in swagger, and errorOnExtraHeaderParameters is true', function() {
      expect(function() {
        hippie(app, swaggerSchema, { errorOnExtraHeaderParameters:true })
        .header("X-New-Header", 1)
        .get('/foos')
        .end();
      }).to.throw(/Parameter not mentioned in swagger spec:/)
    });
  });

  describe('settings', function() {
    it('when validateParameterSchema is off, extra parameters are allowed', function() {
      expect(function() {
        hippie(app, swaggerSchema, { errorOnExtraParameters:false })
        .get('/foos/{fooId}')
        .pathParams({ fooId:data.firstFoo.id, asdf:50 })
        .header('X-Foo', 12)
        .end();
      }).to.not.throw();
    });
  });
});