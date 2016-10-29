'use strict'

describe('parameters', function () {
  it('ignores optional parameters that are missing', function (done) {
    hippie(app, swaggerSchema)
      .get('/foos')
      .end(done)
  })

  it('replaces path parameters with provided variables', function (done) {
    hippie(app, swaggerSchema)
      .get('/foos/{fooId}')
      .pathParams({ fooId: data.firstFoo.id })
      .end(function (err, res) {
        expect(err).to.be.undefined
        expect(res.req.path).to.equal('/foos/' + data.firstFoo.id)
        done()
      })
  })

  it('replaces query string variables', function (done) {
    var limit = 10
    var offset = 2

    hippie(app, swaggerSchema)
      .get('/foos')
      .qs({ limit: limit, offset: offset })
      .end(function (err, res) {
        expect(err).to.be.undefined
        expect(res.req.path).to.equal('/foos?limit=' + limit + '&offset=' + offset)
        done()
      })
  })

  describe('header variables', function () {
    it('errors if the header is required', function () {
      var headerSchema = cloneSwagger(swaggerSchema)

      // set X-Total-Count to be required for this test
      headerSchema['paths']['/foos']['get']['parameters'].filter(function (param) {
        return param.name === 'X-Total-Count'
      })[0]['required'] = true

      expect(hippie(app, headerSchema)
        .get('/foos')
        .end()
      ).to.be.rejectedWith(/Missing required parameter in header: X-Total-Count/)
    })

    it('replaces header variables', function (done) {
      hippie(app, swaggerSchema)
        .get('/foos')
        .header('X-Total-Count', 1)
        .end(function (err, res) {
          expect(err).to.be.undefined
          expect(res.request.headers['X-Total-Count']).to.exist
          expect(res.request.headers['X-Total-Count']).to.equal(1)
          done()
        })
    })
  })

  describe('forms', function () {
    describe('form-data', function () {
      it('works if formData is set to type "file"', function (done) {
        var file = 'Content-Disposition: form-data; name="uploadedFile"'

        hippie(app, swaggerSchema)
          .header('Content-Type', 'multipart/form-data')
          .send(file)
          .post('/foos/{fooId}')
          .pathParams({ fooId: data.firstFoo.id })
          .end(done)
      })

      describe('required file', function () {
        var formSchema
        before(function () {
          formSchema = cloneSwagger(swaggerSchema)
          // set parameter to be required for this test
          formSchema['paths']['/foos/{fooId}']['post']['parameters'].filter(function (param) {
            return param.name === 'uploadedFile'
          })[0]['required'] = true
        })

        it('errors if file is required & missing header and body', function () {
          expect(hippie(app, formSchema)
            .post('/foos/{fooId}')
            .pathParams({ fooId: data.firstFoo.id })
            .end()
          ).to.be.rejectedWith(/Missing required parameter in formData: uploadedFile/)
        })

        it('errors if file is required & missing body', function () {
          expect(hippie(app, formSchema)
            .header('Content-Type', 'multipart/form-data')
            .post('/foos/{fooId}')
            .pathParams({ fooId: data.firstFoo.id })
            .end()
          ).to.be.rejectedWith(/Missing required parameter in formData: uploadedFile/)
        })
      })
    })

    describe('urlencoded', function () {
      it('works if formData is optional & not provided', function (done) {
        hippie(app, swaggerSchema)
          .form()
          .get('/foos')
          .end(done)
      })

      it('works if formData is required & present', function (done) {
        // set formMetadata to be required for this test
        var formSchema = cloneSwagger(swaggerSchema)
        formSchema['paths']['/foos']['get']['parameters'].filter(function (param) {
          return param.name === 'formMetadata'
        })[0]['required'] = true

        hippie(app, formSchema)
          .form()
          .send({ formMetadata: 'formMetadataValue' })
          .get('/foos')
          .end(done)
      })

      it('errors if formData is required & missing', function () {
        var formSchema = cloneSwagger(swaggerSchema)

        // set parameter to be required for this test
        formSchema['paths']['/foos']['get']['parameters'].filter(function (param) {
          return param.name === 'formMetadata'
        })[0]['required'] = true

        expect(hippie(app, formSchema)
          .form()
          .get('/foos')
          .end()
        ).to.be.rejectedWith(/Missing required parameter in formData: formMetadata/)
      })
    })
  })

  describe('errors', function () {
    it('when a required parameter is missing', function () {
      expect(hippie(app, swaggerSchema)
        .get('/foos/{fooId}')
        .end()
      ).to.be.rejectedWith(/Missing required parameter in path: fooId/)
    })

    it('when a parameter fails json-schema validation', function () {
      expect(hippie(app, swaggerSchema)
        .get('/foos/{fooId}')
        .pathParams({ fooId: 45 })
        .end()
      ).to.be.rejectedWith(/Invalid format for parameter {fooId}/)
    })
  })

  describe('settings', function () {
    it('when validateParameterSchema is off, it does not error if parameter fails json-schema validation', function () {
      expect(hippie(app, swaggerSchema, { validateParameterSchema: false })
        .get('/foos/{fooId}')
        .pathParams({ fooId: 45 })
        .end()
      ).to.be.rejected
    })
  })

  describe('methods parameters override path parameters', function () {
    it('rejects when parameter fails json-schema validation', function () {
      expect(hippie(app, swaggerSchema)
        .patch('/foos/{fooId}')
        .pathParams({ fooId: data.firstFoo.id }) // uuid valid at path level, but overriden to integer at method level
        .end()
      ).to.be.rejectedWith(/Invalid format for parameter {fooId}/)
    })

    it('accepts valid method parameters', function (done) {
      hippie(app, swaggerSchema)
        .patch('/foos/{fooId}')
        .pathParams({ fooId: 45 })
        .end(function (err, res) {
          expect(err).to.be.undefined
          expect(res.req.path).to.equal('/foos/' + 45)
          done()
        })
    })
  })
})
