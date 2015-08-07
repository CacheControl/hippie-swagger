'use strict';

var test = require('tape'),
    swaggerDef = require('./swagger.js'),
    middleware = require('../index.js').bind(null, swaggerDef);

var baseUrl = 'http://localhost:8000',
    cb = function() {};

function params(options) {
  options = options || {};
  return {
    method: options.method || 'get',
    'url': options.url || baseUrl
  };
}

test('it appends the path to the url', function(t) {
  t.plan(1);
  var subject = middleware('/foos'), opts = params();
  subject(opts, function(ret) { t.equal(opts.url, baseUrl + '/foos') });
});

test('replaces parameters in the url', function(t) {
  t.plan(1);
  var subject = middleware('/foos/{fooId}', {fooId: 'X'});
  subject(params(), function(ret) {
    t.equals(ret.url, baseUrl + '/foos/X');
  });
});

test('raises an exception a required parameter is missing', function(t) {
  t.plan(1);
  var subject = middleware('/foos/{fooId}', {});
  t.throws(subject.bind(null, params(), cb), /Missing parameter fooId/);
});

test('it should raise an exception if called without a path', function(t) {
  var subject = middleware('/foos/{fooId}');
  t.plan(1);
  t.throws(subject.bind(null, params()));
})