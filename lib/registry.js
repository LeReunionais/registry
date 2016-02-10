var serviceUtil = require('./service')
  , bunyan = require('bunyan')
  , log = bunyan.createLogger({name: "registry"})
  ;
var registry = [];

module.exports = {
  clear: () => {
    registry = [];
    log.info('Cleared registry');
  },
  register: (service) => {
    if (serviceUtil.validate(service)) {
      if (registry.some( s => s.name === service.name)) {
        log.info({new:service, old:registry.find( s => s.name === service.name)}, "Service already exist, it will be overwritten.");
        registry = registry.map( s => {
            if (s.name === service.name) {
              return service;
            } else {
              return s;
            }
        })
      } else {
        registry = registry.concat(service);
      }
    } else {
      log.warn({service}, "Submitted service is not a valid service. It will be not be added to registry.");
    }
    return registry.slice(0);
  },
  registry: () => {
    return registry.slice(0);
  },
  find: (service_name) => {
    return registry.find( (service) => {
      return service.name === service_name;
    });
  }
}
