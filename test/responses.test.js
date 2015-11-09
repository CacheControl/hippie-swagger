describe('responses', function () {
  it('errors when status code is not specified in the swagger file', function (done) {
    hippie(app, swaggerSchema)
      .put('/invalid-foos')
      .end(function (err) {
        expect(err.message).to.match(/No mention of statusCode: 200/)
        done()
      })
  })
})
