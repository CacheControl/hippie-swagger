'use strict';

var test = require('tape-catch'),
    swaggerDef = require('./swagger.js'),
    middleware = require('../index.js').bind(null, swaggerDef);

var baseUrl = 'http://localhost:8000',
    cb = function() {},
    uuid = '7c896eab-3e5c-4403-8744-bbbb61b23249';

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
  var subject = middleware('/foos/{fooId}', {fooId: uuid});
  subject(params(), function(ret) {
    t.equals(ret.url, baseUrl + '/foos/' + uuid);
  });
});

test('sets the url based on parameters provided', function(t) {
  t.plan(1);
  var subject = middleware('/foos/{fooId}', {fooId: uuid});
  subject(params(), function(ret) {
    t.equals(ret.url, baseUrl + '/foos/' + uuid);
  });
});

test('raises an exception a required parameter is missing', function(t) {
  t.plan(1);
  var subject = middleware('/foos/{fooId}', {});
  t.throws(subject.bind(null, params(), cb), /Missing required parameter: fooId/);
});

test('raises an exception when a parameter is invalid', function(t) {
  t.plan(1);
  var subject = middleware('/foos/{fooId}', {fooId: 'not-a-uuid'});
  t.throws(subject.bind(null, params(), cb), /Invalid format for parameter {fooId}, received: /);
});

test('it should raise an exception if called without a path', function(t) {
  var subject = middleware('/foos/{fooId}');
  t.plan(1);
  t.throws(subject.bind(null, params()));
})