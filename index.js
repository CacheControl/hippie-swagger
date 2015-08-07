'use strict';

module.exports = function(swaggerDef, path, parameters) {
  parameters = parameters || [];
  return function(options, next) {
    if(!swaggerDef.paths[path]) {
      throw new Error('Swagger spec does not define path: ' + path);
    }
    if(!options.method) {
      throw new Error('options must specify a request method(get, post, delete, etc)');
    }
    if(!swaggerDef.paths[path][options.method]) {
      throw new Error('Swagger spec does not define method: ' + options.method);
    }
    var spec = swaggerDef.paths[path][options.method];

    //default to json
    //if(!spec.consumes || spec.consumes.includes('application/json')) {
    //  //todo - set request options for this.json();
    //}
    var renderedPath = path;
    if(spec.parameters && spec.parameters.length) {
      spec.parameters.forEach(function(param) {
        if(parameters[param.name] === undefined && param.required) {
          throw new Error('Missing parameter ' + param.name);
        }
        var regex = new RegExp('{' + param.name + '}', 'g');
        renderedPath = renderedPath.replace(regex, parameters[param.name]);
        //todo validate parameter existence in options
        //todo validate parameter meets json schema spec
      });
    }
    //todo validate the response using json-schema
    options.url = options.url + renderedPath;
    next(options);
  };
}