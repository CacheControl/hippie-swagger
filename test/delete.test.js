'use strict'

describe('DELETE requests', function () {
  it('works when valid', function (done) {
    hippie(app, swaggerSchema)
      .del('/foos/{fooId}')
      .pathParams({ fooId: data.firstFoo.id })
      .end(function (err, res) {
        expect(err).to.be.undefined
        expect(res.body).to.eql('')
        done()
      })
  })

  describe('when path is missing a response schema', function () {
    it('errors if a response is actually returned', function (done) {
      hippie(app, swaggerSchema)
        .del('/invalid-foos')
        .end(function (err, res) {
          expect(err.message).to.match(/Received non-empty response from \/invalid-foos/)
          done()
        })
    })
  })
})
