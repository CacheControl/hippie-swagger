'use strict';

var swaggerParser = require('swagger-parser');

module.exports = {
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
                      "type": "array",
                      "items": {
                          "$ref": "/foo"
                      }
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
                        "$ref": "/foo"
                    }
                  }
                ],
                "responses": {
                  "201": {
                    "description": "Successful response",
                    "schema": {
                        "$ref": "/foo"
                    }
                  }
                }
            }
        },
        "/invalid-foos": {
            "get": {
              "description": "Server returns data that does not validate",
              "responses": {
                "200": {
                    "description": "Successful response",
                    "schema": {
                      "type": "array",
                      "items": {
                          "$ref": "/foo"
                      }
                    }
                },
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
                            "$ref": "/foo"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "/foo": {
            "title": "Foo object definition",
            "description": "Schema for a foo object.",
            "type": "object",
            "required": ["id", "description", "orderNumber"],
            "properties": {
                "id": {
                    "description": "primary identifier",
                    "$ref": "#/definitions/uuid"
                },
                "description": {
                    "description": "an explanation of the foo",
                    "type": "string",
                },
                "orderNumber": {
                    "description": "the order index of the foo",
                    "type": "integer",
                }
            }
        },
        "uuid": {
            "title": "UUID",
            "description": "Schema defining structure of a string representation of a uuid.",
            "type": "string",
            "pattern": "^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$"
        }
    }
};