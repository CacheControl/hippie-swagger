'use strict';

var swaggerParser = require('swagger-parser');

var schema = {
    "swagger": "2.0",
    "info": {
        "version": "1.0.0",
        "title": "Test App"
    },
    "paths": {
        "/foos": {
            "get": {
              "description": "List all foos",
              "responses": {
                "200": {
                    "description": "Successful response",
                    "schema": {
                        "$ref": "/foo-base"
                    }
                },
              }
            },
            "post": {
                "description": "Create a foo",
                "parameters": [
                  {
                    "in": "body",
                    "name": "body",
                    "description": "foo object to be added",
                    "required": true,
                    "schema": {
                        "$ref": "/foo-new"
                    }
                  }
                ],
                "responses": {
                  "200": {
                    "description": "Successful response",
                    "schema": {
                        "$ref": "/foo-base"
                    }
                  },
                  "401": {
                      "description": "unauthorized - invalid or expired jwt"
                  },
                  "404": {
                      "description": "foo not found"
                  }
                }
            }
        },
        "/foos/{fooId}": {
            "get": {
                "description": "Retrieving a foo",
                "parameters": [
                    {
                        "name": "fooId",
                        "in": "path",
                        "description": "foo identifier",
                        "required": true,
                        "type": "string",
                        "pattern": "^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Successful response",
                        "schema": {
                            "$ref": "/foo-base"
                        }
                    },
                    "401": {
                        "description": "unauthorized - invalid or expired jwt"
                    },
                    "404": {
                        "description": "foo not found"
                    }
                }
            }
        }
    },
    "definitions": {
        "/foo-new": {
            "title": "New Foo",
            "description": "Schema for a foo object.",
            "type": "object",
            "properties": {
                "id": {
                    "description": "primary identifier",
                    "$ref": "#/definitions/uuid",
                    "required": true
                },
                "description": {
                    "description": "an explanation of the foo",
                    "type": "string"
                },
                "orderNumber": {
                    "description": "the order index of the foo",
                    "type": "integer"
                }
            }
        },
        "/foo-base": {
            "title": "Base of a foo Record",
            "description": "Schema for a foo object without boilerplate dates.",
            "type": "object",
            "allOf": [
                {
                    "$ref": "/foo-new"
                },
                {
                    "properties": {
                        "id": {
                            "description": "primary identifier for this foo",
                            "$ref": "#/definitions/uuid",
                            "required": true
                        }
                    }
                }
            ]
        },
        "uuid": {
            "title": "UUID",
            "description": "Schema defining structure of a string representation of a uuid.",
            "type": "string",
            "pattern": "^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$"
        },
    }
};

swaggerParser.parse(schema, function(err, api, metadata) {
  if(err) throw err;
  schema = api;
});

module.exports = schema;