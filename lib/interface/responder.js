var registry = require('../registry.js')
  , jsonrpc = require('../jsonrpc/jsonrpc')
  ;

var log = require('bunyan').createLogger({name:"registry/responder"});

var zmq = require('zmq')
  , responder = zmq.socket('rep');

var SERVICE_NOT_FOUND = 'SERVICE_NOT_FOUND';

function find(service_to_find) {
  return new Promise ( (resolve) => {
    const result = registry.find(service_to_find.name);
    if (result !== undefined) {
      log.info('Service found');
      resolve(result);
    } else {
      log.info('Not able to find service: %s', service_to_find.name);
      responder.emit(SERVICE_NOT_FOUND, service_to_find.name);
      responder.once(service_to_find.name + "_found", () => {
        resolve(find(service_to_find))
      });
    }
  })
}
responder.on('message', (msg) => {
  const message = JSON.parse(msg.toString());
  if (jsonrpc.validate(message).valid) {
    log.info('received message:', JSON.stringify(message));
    switch (message.method) {
      case 'find':
        find(message.params.service)
        .then( service => responder.send(JSON.stringify(service)));
      break;
      default:
      log.info('Unknown action: %s', message.method);
      responder.send(JSON.stringify({
        error: "Unknown action. Supported action: [find]"
      }))
    }
  } else {
    log.error('%s is not a valid json rpc message', msg.toString());
    log.error(jsonrpc.validate(message).message);
  }
});

module.exports = {
  bind: (protocol, port, cb) => {
    responder.bindSync(`${protocol}://*:${port}`);
    cb();
  },
  on: (event, cb) => {
    responder.on(event, (service_name) => {
      cb(service_name);
    })
  },
  emit: (event, arg) => {
    responder.emit(event, arg);
  },
  SERVICE_NOT_FOUND
}
