'use strict';

var swaggerParser = require('swagger-parser'),
    swaggerSpec = require('./swagger.js');

global.expect = require('chai').expect;
global.data = require('./data');
global.app = require('./server');
global.hippie = require('../../index');

swaggerParser.dereference(swaggerSpec, function(err, api, metadata) {
  if(err) {
    console.error(err);
    process.exit(1);
  }
  global.swaggerSchema = api;
  run(err);
});
