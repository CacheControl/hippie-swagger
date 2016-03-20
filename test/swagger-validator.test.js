var schema = {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Valid Application'
  },
  paths: {}
}
var objectAssign = require('object-assign')

describe('swagger-validator', function () {
  it('passes valid schemas', function () {
    expect(function () {
      hippie(app, schema)
    }).to.not.throw()
  })

  describe('errors', function () {
    it('if a swagger definition is not provided', function () {
      expect(function () {
        hippie(app)
      }).to.throw(/Swagger schema required/)
    })

    it('if the swagger definition does not include required properties', function () {
      Object.keys(schema).forEach(function (key) {
        var invalidSchema = objectAssign({}, schema)
        delete invalidSchema[key]
        var regex = new RegExp('Swagger schema invalid', 'g')

        expect(function () {
          hippie(app, invalidSchema)
        }).to.throw(regex)
      })
    })
  })
})
