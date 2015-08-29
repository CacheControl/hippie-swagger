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