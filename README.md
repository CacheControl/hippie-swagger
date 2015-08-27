![hippie](http://i.imgur.com/ZEkuNZG.png) SWAGGER

_"The confident hippie"_

## Synopsis

[Hippie](https://github.com/vesln/hippie) wrapper that provides end-to-end API testing with built-in [swagger](http://swagger.io) validation

## Features

* All [hippie](https://github.com/vesln/hippie) features included via peer-dependency
* Guarantees application is in sync with swagger definition
* Parameters and responses validated against swagger json-schema
* Support for path, query string, header, and body variables

## Installation

```
npm install hippie-swagger
```

## Basic Usage

```js
var hippie = require('hippie-swagger'),
    swagger = require('your-swagger-file');

hippie(app, swagger)          //dereferenced swagger file as a second argument
.get('/users/{username}')     //verbs work as before, except use the swagger path
.pathParams({                 //new method, used to replace variables in the path
  username: 'cachecontrol'
})
.expectStatus(200)            //status codes must exist in the swagger file
.expectValue('user.first', 'John')  //hippie expectations work as usual
.expectHeader('cache-control', 'no-cache')
.end(function(err, res, body) {
  if (err) throw err;
});
```

## Usage
* When specifying a url(.get, .post, .patch, .url, etc), use the [swagger path](http://swagger.io/specification/#pathsObject)
* If the url contains a variable, hippie-swagger will prompt you define them with [pathParams](#pathparams)
* These caveats aside, use hippie as you normally would.

### #pathParams
The only method added by hippie-swagger.  Replaces variables contained in the swagger path.

```js
hippie(app, swagger)
.get('/projects/{projectId}/tasks/{taskId}')
.pathParams({
  projectId: 123,
  taskId: 99
})
.end(function(err, res, body) {
  if (err) throw err;
});
```

### Examples
See the examples folder

## Validations

When hippie-swagger detects it is interacting with the app in ways not specified in the swagger file, it will let you know by throwing an error.  The idea is to use hippie's core features to write API tests(as you normally would), and hippie-swagger will only interject if the swagger definition falls behind or becomes out of sync.

Below are list of some of the validations that hippie-swagger checks for:

### Paths
```js
hippie(app, swagger)
.get('/pathNotMentionedInSwagger')
.end(function(err, res, body) {
  if (err) throw err;
});
// throws:
//  Swagger spec does not define path: pathNotMentionedInSwagger
```

### Parameters
```js
hippie(app, swagger)
.get('/users/{username}')
.pathParams({
  username: 123,
})
.end(function(err, res, body) {
  if (err) throw err;
});
// throws:
//   Invalid format for parameter {username}
```