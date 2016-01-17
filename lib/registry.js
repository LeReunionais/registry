var serviceUtil = require('./service');
var registry = [];

module.exports = {
  clear: () => {
    registry = [];
    console.log('Cleared registry');
  },
  register: (service) => {
    if (serviceUtil.validate(service)) {
      registry = registry.concat(service);
    } else {
      console.log(`${JSON.stringify(service)} is not a valid service. It will be not be added to registry.`)
    }
    return registry.slice(0);
  },
  registry: () => {
    return registry.slice(0);
  },
  find: (service_name) => {
    console.log(JSON.stringify(registry));
    return registry.find( (service) => {
      return service.name === service_name;
    });
  }
}
