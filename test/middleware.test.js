'use strict'

var middleware = require('../lib/middleware')
var next = function () {}
var options = { method: 'get', url: '/foos' }

function hippieStub (options) {
  options = options || { qs: { limit: 0, offset: 0 } }
  return new function () {
    this._url = options.url || '/foos'
    this.expect = function () {}
  }()
}
var ctx = hippieStub()

describe('middleware', function () {
  it('calls next with options', function () {
    middleware.call(ctx, swaggerSchema, options, function (opts) {
      expect(opts).to.eql(options)
    })
  })

  it('accepts mixed-case request methods', function () {
    middleware.call(ctx, swaggerSchema, { method: 'GET', url: '/foos' }, function (opts) {
      expect(opts).to.exist
    })
  })

  it('url decodes the path', function () {
    var pathCtx = hippieStub({url: '/foos/%7BfooId%7D'})
    pathCtx.swaggerParams = { path: { fooId: '6e9b25c2-7c22-44c5-8890-15613aa1fb6a' } }
    middleware.call(pathCtx, swaggerSchema, { method: 'GET', url: '/foos/{fooId}' }, function (opts) {
      expect(opts).to.exist
    })
  })

  it('merges operation and path parameters', function () {
    var pathCtx = hippieStub({url: '/foos/%7BfooId%7D'})
    pathCtx.swaggerParams = { path: { fooId: '6e9b25c2-7c22-44c5-8890-15613aa1fb6a' } }
    middleware.call(pathCtx, swaggerSchema, { method: 'DELETE', url: '/foos/{fooId}' }, function (opts) {
      expect(opts.url).to.eql('/foos/6e9b25c2-7c22-44c5-8890-15613aa1fb6a')
    })
  })

  describe('throws an error', function () {
    it('when the path is not defined in the swagger schema', function () {
      var pathCtx = hippieStub({url: 'pathNotMentionedInSwagger'})
      expect(middleware.bind(pathCtx, swaggerSchema, options, next))
        .to.throw(/Swagger spec does not define path: pathNotMentionedInSwagger/)
    })

    it('when the options is missing a method', function () {
      expect(middleware.bind(ctx, swaggerSchema, {}, next))
        .to.throw(/No request method provided/)
    })

    it('when the request method is not defined in the swagger schema', function () {
      expect(middleware.bind(ctx, swaggerSchema, {method: 'put'}, next))
        .to.throw(/Swagger spec does not define method: "put"/)
    })
  })

  describe('basePath support', function () {
    it('basePath is set', function () {
      swaggerSchema.basePath = '/base'
      ctx._url = '/base/foos'
      middleware.call(ctx, swaggerSchema, options, function (opts) {
        expect(opts).to.eql(options)
      })
    })

    it('basePath is set and subpath is /', function () {
      var originalSwaggerSchema = swaggerSchema.basePath
      var basePathOptions = {method: 'GET', url: '/'}
      swaggerSchema.basePath = '/base'
      ctx._url = '/base'

      middleware.call(ctx, swaggerSchema, basePathOptions, function (opts) {
        expect(opts).to.eql(basePathOptions)
      })
      swaggerSchema.basePath = originalSwaggerSchema
    })

    it('basePath is set but equal to /', function () {
      swaggerSchema.basePath = '/'
      ctx._url = '/foos'
      middleware.call(ctx, swaggerSchema, options, function (opts) {
        expect(opts).to.eql(options)
      })
    })
  })
})
