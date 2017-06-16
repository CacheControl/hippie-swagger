'use strict'

module.exports = {
  'swagger': '2.0',
  'info': {
    'version': '1.0.0',
    'title': 'Test App'
  },
  'paths': {
    '/': {
      'get': {
        'description': 'List foos from base path',
        'responses': {
          '200': {
            'description': 'Successful response',
            'schema': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/foo'
              }
            }
          }
        }
      }
    },
    '/foos': {
      'get': {
        'description': 'List all foos',
        'parameters': [{
          'name': 'limit',
          'in': 'query',
          'description': 'resultset limiter for pagination',
          'required': false,
          'type': 'number'
        }, {
          'name': 'offset',
          'in': 'query',
          'description': 'resultset offset for pagination',
          'required': false,
          'type': 'number'
        }, {
          'name': 'X-Total-Count',
          'in': 'header',
          'description': 'header example',
          'required': false,
          'type': 'number'
        }, {
          'name': 'formMetadata',
          'in': 'formData',
          'description': 'Additional data to pass to server',
          'required': false,
          'type': 'string'
        }],
        'responses': {
          '200': {
            'description': 'Successful response',
            'schema': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/foo'
              }
            }
          }
        }
      },
      'post': {
        'description': 'Create a foo',
        'parameters': [{
          'in': 'body',
          // Swagger spec: "The name of the body parameter has no effect on the parameter itself"
          'name': 'name-irrelevant',
          'description': 'foo object to be added',
          'required': true,
          'schema': {
            '$ref': '#/definitions/foo'
          }
        }],
        'responses': {
          '201': {
            'description': 'Successful response',
            'schema': {
              '$ref': '#/definitions/foo'
            }
          }
        }
      }
    },
    '/invalid-foos': {
      'get': {
        'description': 'Server returns data that does not validate',
        'responses': {
          '200': {
            'description': 'Successful response',
            'schema': {
              'type': 'array',
              'items': {
                '$ref': '#/definitions/foo'
              }
            }
          }
        }
      },
      'post': {
        'description': 'Server returns data that does not validate',
        'responses': {
          '200': {
            'description': 'Server returns data that does not validate',
            'schema': {
              '$ref': '#/definitions/foo'
            }
          }
        },
        'parameters': [{
          'in': 'body',
          'name': 'body',
          'description': 'foo object to be added',
          'required': true,
          'schema': {
            '$ref': '#/definitions/foo'
          }
        }]
      },
      'delete': {
        'description': 'Server returns data that does not validate',
        'responses': {
          '200': {
            'description': 'Deleted. No content'
          }
        }
      },
      'put': {
        'description': 'Server returns data that does not validate',
        'responses': {
          '204': {
            'description': 'Updated.  No content.'
          }
        }
      }
    },
    '/foos/{fooId}': {
      'parameters': [{
        'name': 'fooId',
        'in': 'path',
        'description': 'foo identifier',
        'required': true,
        'type': 'string',
        'pattern': '^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$'
      }],
      'get': {
        'description': 'Retrieving a foo',
        'responses': {
          '200': {
            'description': 'Successful response',
            'schema': {
              '$ref': '#/definitions/foo'
            }
          }
        }
      },
      'patch': {
        'description': 'Patching a foo',
        'parameters': [{
          'name': 'fooId',
          'in': 'path',
          'description': 'foo identifier (integer override)',
          'required': true,
          'type': 'integer'
        }],
        'responses': {
          '200': {
            'description': 'Successful response',
            'schema': {
              '$ref': '#/definitions/foo'
            }
          }
        }
      },
      'post': {
        'description': 'Upload file example',
        consumes: [
          'multipart/form-data'
        ],
        'responses': {
          '201': {
            'description': 'noop'
          }
        },
        'parameters': [{
          'in': 'formData',
          'name': 'uploadedFile',
          'type': 'file',
          'description': 'file upload',
          'required': false
        }]
      },
      'delete': {
        'description': 'Deleting a foo',
        'parameters': [],
        'responses': {
          '204': {
            'description': 'Deleted. No content'
          }
        }
      }
    },
    '/integerTest/{fooId}': {
      'parameters': [{
        'name': 'fooId',
        'in': 'path',
        'description': 'foo identifier',
        'required': true,
        'type': 'integer'
      }],
      'get': {
        'description': 'get via integer',
        'responses': {
          '200': {
            'description': 'Successful response',
            'schema': {
              '$ref': '#/definitions/simple'
            }
          }
        }
      },
      'patch': {
        'description': 'patch via integer',
        'consumes': 'application/x-www-form-urlencoded',
        'parameters': [{
          'name': 'barId',
          'in': 'formData',
          'description': 'bar identifier',
          'required': true,
          'type': 'integer'
        }],
        'responses': {
          '200': {
            'description': 'Successful response',
            'schema': {
              '$ref': '#/definitions/simple'
            }
          }
        }
      },
      'post': {
        'description': 'post with integers',
        'consumes': 'application/x-www-form-urlencoded',
        'responses': {
          '201': {
            'description': 'noop'
          }
        },
        'parameters': [{
          'name': 'barId',
          'in': 'formData',
          'description': 'bar identifier',
          'required': true,
          'type': 'integer'
        }]
      },
      'delete': {
        'description': 'delete with integers',
        'parameters': [],
        'responses': {
          '204': {
            'description': 'Deleted. No content'
          }
        }
      }
    }
  },
  'definitions': {
    'foo': {
      'title': 'Foo object definition',
      'description': 'Schema for a foo object.',
      'type': 'object',
      'required': ['id', 'description', 'orderNumber'],
      'properties': {
        'id': {
          'description': 'primary identifier',
          '$ref': '#/definitions/uuid'
        },
        'description': {
          'description': 'an explanation of the foo',
          'type': 'string'
        },
        'orderNumber': {
          'description': 'the order index of the foo',
          'type': 'integer'
        }
      }
    },
    'simple': {
      'type': 'object',
      'required': ['status'],
      'properties': {
        'status': {
          'type': 'string'
        }
      }
    },
    'uuid': {
      'title': 'UUID',
      'description': 'Schema defining structure of a string representation of a uuid.',
      'type': 'string',
      'pattern': '^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$'
    }
  }
}
