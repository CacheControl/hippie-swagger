describe('POST requests', function () {
  var validPostBody = {
    id: '241a4d44-5b90-41fa-9454-5aa6568087e4',
    description: 'third foo',
    orderNumber: 3
  }

  it('works when valid', function (done) {
    hippie(app, swaggerSchema)
      .post('/foos')
      .send(validPostBody)
      .end(function (err, res) {
        expect(err).to.be.undefined
        done()
      })
  })

  it('errors when the post body is invalid', function () {
    expect(hippie(app, swaggerSchema)
      .post('/foos')
      .send({
        bogus: 'post-body'
      })
      .end()
    ).to.be.rejectedWith(/Invalid format for parameter/)
  })

  it('errors when the post response is invalid', function (done) {
    hippie(app, swaggerSchema)
      .post('/invalid-foos')
      .send(validPostBody)
      .end(function (err) {
        expect(err.message).to.match(/Response from \/invalid-foos failed validation/)
        done()
      })
  })
})
