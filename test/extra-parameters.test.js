'use strict'

describe('extra parameters', function () {
  it('errors on path parameters not mentioned in the swagger spec', function () {
    expect(hippie(app, swaggerSchema)
      .get('/foos')
      .pathParams({ unmentionedParam: 50 })
      .end()
    ).to.be.rejectedWith(/path parameter not mentioned in swagger spec: "unmentionedParam"/)
  })

  describe('formData', function () {
    it('errors on formData parameters not mentioned in the swagger spec', function () {
      expect(hippie(app, swaggerSchema)
        .get('/foos')
        .form()
        .send({unmentionedParam1: 'nothing', unmentionedParam2: 'nothing'})
        .end()
      ).to.be.rejectedWith(/formData parameter not mentioned in swagger spec: "unmentionedParam1"/)
    })

    it('errors on formData file parameters not mentioned in the swagger spec', function () {
      var file = 'Content-Disposition: form-data; name="uploadedFile"'

      expect(hippie(app, swaggerSchema)
        .header('Content-Type', 'multipart/form-data')
        .send(file)
        .get('/foos')
        .end()
      ).to.be.rejectedWith(/formData \(expected type "file"\) parameter not mentioned in swagger spec: ""Content-Disposition/)
    })
  })

  it('errors on body parameters not mentioned in the swagger spec', function () {
    expect(hippie(app, swaggerSchema)
      .get('/foos')
      .send({unmentionedParam1: 'nothing'})
      .end()
    ).to.be.rejectedWith(/Request "body" present, but Swagger spec has no body parameter mentioned/)
  })

  describe('header parameters', function () {
    it('does not error if the header was not mentioned in swagger', function () {
      expect(function () {
        hippie(app, swaggerSchema)
          .header('X-New-Header', 1)
          .get('/foos')
          .end()
      }).to.not.throw()
    })

    it('errors if the header was not mentioned in swagger, and errorOnExtraHeaderParameters is true', function () {
      expect(hippie(app, swaggerSchema, { errorOnExtraHeaderParameters: true })
        .header('X-New-Header', 1)
        .get('/foos')
        .end()
      ).to.be.rejectedWith(/header parameter not mentioned in swagger spec:/)
    })
  })

  describe('settings', function () {
    it('when validateParameterSchema is off, extra parameters are allowed', function () {
      expect(function () {
        hippie(app, swaggerSchema, { errorOnExtraParameters: false })
          .get('/foos/{fooId}')
          .pathParams({ fooId: data.firstFoo.id, asdf: 50 })
          .header('X-Foo', 12)
          .end()
      }).to.not.throw()
    })
  })
})
