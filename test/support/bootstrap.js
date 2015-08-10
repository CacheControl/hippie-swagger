'use strict';

var swaggerParser = require('swagger-parser'),
    swaggerSpec = require('./swagger.js');

global.expect = require('chai').expect;
global.data = require('./data');

swaggerParser.parse(swaggerSpec, function(err, api, metadata) {
  if(err) console.log(err);
  global.swaggerSchema = api;
  run(err);
});
