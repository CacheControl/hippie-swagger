/**
 * External dependencies.
 */

var express = require('express');

/**
 * Server.
 */

var app = express();

app.all('/foos', function(req, res) {
  res.send(data.foos);
});

//valid path with invalid response
app.all('/invalid-foos', function(req, res) {
  res.send([{'invalid-foo': true}]);
});

app.get('/foos/:fooId', function(req, res) {
  res.send(data.firstFoo);
});

/**
 * Primary export.
 */

module.exports = app;

/**
 * Export the configured port.
 */

module.exports.PORT = process.env.HIPPIE_PORT || 7891;