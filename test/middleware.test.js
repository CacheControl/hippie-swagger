'use strict';

var middleware = require('../lib/middleware'),
    next = new Function(),
    options = { method: 'get' };

function hippieStub(options) {
  options = options || {};
  return new function() {
    this._url = options.url || '/foos';
    this.expect = new Function();
  }
}
var ctx = hippieStub();

describe('middleware', function() {
  it('calls next with options', function() {
    middleware.call(ctx, swaggerSchema, options, function(opts) {
      expect(opts).to.equal(options);
    });
  });

  it('accepts mixed-case request methods', function() {
    middleware.call(ctx, swaggerSchema, {method: 'GET'}, function(opts) {
      expect(opts).to.exist;
    });
  });

  describe('throws an error', function() {
    it('when the path is not defined in the swagger schema', function() {
      var pathCtx = hippieStub({url: 'pathNotMentionedInSwagger'});
      expect(middleware.bind(pathCtx, swaggerSchema, options, next))
        .to.throw(/Swagger spec does not define path/);
    });

    it('when the options is missing a method', function() {
      expect(middleware.bind(ctx, swaggerSchema, {}, next))
        .to.throw(/No request method provided/);
    });

    it('when the request method is not defined in the swagger schema', function() {
      expect(middleware.bind(ctx, swaggerSchema, {method: 'put'}, next))
        .to.throw(/Swagger spec does not define method/);
    });
  });
});
