var registry = require('../registry.js')
  , jsonrpc = require('../jsonrpc/jsonrpc')
  ;

var zmq = require('zmq')
  , responder = zmq.socket('rep');

responder.on('message', (msg) => {
  const message = JSON.parse(msg.toString());
  if (jsonrpc.validate(message).valid) {
    console.log('received message:', JSON.stringify(message));
    switch (message.method) {
      case 'find':
      const service_to_find = message.params.service;
      const result = registry.find(service_to_find.name);
      if (result !== undefined) {
        console.log('Service found');
        responder.send(JSON.stringify(result));
      } else {
        console.log('Not able to find service: %s', service_to_find.name);
        responder.emit('service not found', service_to_find.name);
      }
      break;
      default:
      console.log('Unknown action: %s', message.method);
      responder.send(JSON.stringify({
        error: "Unknown action. Supported action: [find]"
      }))
    }
  } else {
    console.error('%s is not a valid json rpc message', msg.toString());
    console.error(jsonrpc.validate(message).message);
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
  }
}
