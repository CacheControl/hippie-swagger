/**
 * External dependencies.
 */

var express = require('express');

/**
 * Server.
 */

var app = express();


/*
 * endpoints w/valid responses
 */

app.all('/foos', function(req, res) {
  res.send(data.foos);
});

app.get('/foos/:fooId', function(req, res) {
  res.send(data.firstFoo);
});

app.post('/foos', function(req, res) {
  res.send(req.body);
});

/*
 * endpoints with invalid response
 */
app.all('/invalid-foos', function(req, res) {
  res.send([{'invalid-foo': true}]);
});



/**
 * Primary export.
 */

module.exports = app;

/**
 * Export the configured port.
 */

module.exports.PORT = process.env.HIPPIE_PORT || 7891;