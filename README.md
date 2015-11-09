![hippie-swagger](http://i.imgur.com/icjd94P.png)

_"The confident hippie"_

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Synopsis

[Hippie](https://github.com/vesln/hippie) wrapper that provides end-to-end API testing with built-in [swagger](http://swagger.io) validation

## Features

* All [hippie](https://github.com/vesln/hippie) features included via peer-dependency
* Ensures application is in sync with swagger definition
* Parameters and responses validated against swagger format
* Support for path, query string, header, and body variables

## Installation

```
npm install hippie-swagger --save-dev
```

## Basic Usage

```js
var hippie = require('hippie-swagger'),
    swagger = require('your-swagger-file');

hippie(app, swagger)
.get('/users/{username}')
.pathParams({
  username: 'cachecontrol'
})
.expectStatus(200)
.expectValue('user.first', 'John')
.expectHeader('cache-control', 'no-cache')
.end(function(err, res, body) {
  if (err) throw err;
});
```

## Usage
* When specifying a url(.get, .post, .patch, .url, etc), use the [swagger path](http://swagger.io/specification/#pathsObject)
* If the url contains a variable, hippie-swagger will prompt you define them using [pathParams](#pathparams)
* Hippie's .json() method is called automatically on every request
* These aside, use hippie as you normally would.

### #pathParams
Replaces variables contained in the swagger path.

```js
hippie(app, swagger)
.get('/projects/{projectId}/tasks/{taskId}')
.pathParams({
  projectId: 123,
  taskId: 99
})
.end(fn);
```

## Options

To customize behavior, an ```options``` hash may be passed as a third argument:
```js
var options = {
  validateResponseSchema: true,
  validateParameterSchema: true,
  errorOnExtraParameters: true,
  errorOnExtraHeaderParameters: false
};
hippie(app, swagger, options)
```

```validateResponseSchema``` - Validate the server's response against the swagger json-schema definition (default: ```true```)

```validateParameterSchema``` - Validate the request parameters against the swagger json-schema definition (default: ```true```)

```errorOnExtraParameters``` - Throw an error if a parameter is missing from the swagger file  (default: ```true```)

```errorOnExtraHeaderParameters``` - Throw an error if a request header is missing from the swagger file.  By default this is turned off, because it results in every request needing to specify the "Content-Type" and "Accept" headers, which quickly becomes verbose. (default: ```false```)


## Example
See the [example](example/index.js) folder

## Validations

When hippie-swagger detects it is interacting with the app in ways not specified in the swagger file, it will throw an error and fail the test.  The idea is to use hippie's core features to write API tests as per usual, and hippie-swagger will only interject if the swagger definition is violated.

Below are list of some of the validations that hippie-swagger checks for:

### Paths
```js
hippie(app, swagger)
.get('/pathNotMentionedInSwagger')
.end(fn);
// path does not exist in swagger file; throws:
//    Swagger spec does not define path: pathNotMentionedInSwagger
```

### Parameter format
```js
hippie(app, swagger)
.get('/users/{userId}')
.pathParams({
  userId: 'string-value',
})
.end(fn);
// userId provided as a string, but swagger specifies it as an integer; throws:
//    Invalid format for parameter {userId}
```

### Required Parameters
```js
hippie(app, swagger)
.get('/users/{username}')
.end(fn);
// "username" is marked 'required' in swagger file; throws:
//    Missing required parameter in path: username
```

### Extraneous Parameters
```js
hippie(app, swagger)
.get('/users')
.pathParams({
  extraParam: 'will-throw',
})
.end(fn);
// "extraParam" not mentioned swagger file; throws:
//    Parameter not mentioned in swagger spec: "extraParam"
```

### Response format
```js
hippie(app, swagger)
.get('/users')
.end(fn);
// body failed to validate against swagger file's "response" schema; throws:
//    Response from /users failed validation: [failure description]
```

### Method validation
```js
hippie(app, swagger)
.post('/users')
.end(fn);
// "post" method not mentioned in swagger file; throws:
//    Swagger spec does not define method: "post" in path /users
```

### Post body format
```js
hippie(app, swagger)
.post('/users')
.send({"bogus":"post-body"})
.end(fn);

// post body fails to validate against swagger file's "body" parameter; throws:
//    Invalid format for parameter {body}, received: {"bogus":"post-body"}
```

### Form Url-Encoded Parameters
```js
hippie(app, swagger)
.form()
.post('/users')
.send({})
.end(fn);

// "username" is {required: true, in: formData} in swagger; throws:
//    Missing required parameter in formData: username
```

### Multipart Forms
```js
hippie(app, swagger)
.header('Content-Type','multipart/form-data')
.send()
.post('/users/upload')
.end(fn);

// "fileUpload" is {required: true, in: formData, type: file} in swagger; throws:
//    Missing required parameter in formData: fileUpload
```

## Troubleshooting

The most common mistake is forgetting to dereference the swagger file:

```js
"'Error: cant resolve reference ...'
```

Dereferencing can be accomplished using [swagger-parser](https://github.com/BigstickCarpet/swagger-parser/blob/master/docs/swagger-parser.md#dereferenceapi-options-callback).  Also, see the [example](example/index.js).