var nock = require('nock')

describe('hippie-swagger', function () {
  var options = { validateResponseSchema: false }

  it('works with 3 arguments', function (done) {
    hippie(app, swaggerSchema, options)
      .get('/foos/{fooId}')
      .pathParams({ fooId: data.firstFoo.id })
      .end(function (err, res) {
        expect(err).to.be.undefined
        done()
      })
  })

  describe('2 arguments', function () {
    it('app and swagger', function (done) {
      hippie(app, swaggerSchema)
      .get('/foos/{fooId}')
      .pathParams({ fooId: data.firstFoo.id })
      .end(function (err, res) {
        expect(err).to.be.undefined
        done()
      })
    })

    it('swagger and options', function (done) {
      var HOST = 'http://localhost:3000'
      var PATH = '/foos/' + data.firstFoo.id
      nock(HOST)
      .get(PATH)
      .reply(200)

      hippie(swaggerSchema, options)
      .get(HOST + '/foos/{fooId}')
      .pathParams({ fooId: data.firstFoo.id })
      .end(function (err, res) {
        expect(err).to.be.undefined
        done()
      })
    })
  })
})
