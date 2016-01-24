var registry = require('../registry.js')
  , jsonrpc = require('../jsonrpc/jsonrpc.js')
  ;

var zmq = require('zmq')
  , pullSocket = zmq.socket('pull');

pullSocket.on('message', (msg) => {
  const message = JSON.parse(msg.toString());
  if (jsonrpc.validate(message)) {
    console.log(message);
    switch(message.method) {
      case 'register':
        const new_service = message.params.service;
        console.log('New service: %s', JSON.stringify(new_service));
        registry.register(new_service);
      break;
      default:
        console.log('Unknown method: %s', message.method);
    }
  } else {
    console.error('%s is not a valid json rpc message', msg.toString());
    console.error(jsonrpc.validate(message).message);
  }
});

module.exports = {
  bind: (protocol, port, cb) => {
    pullSocket.bindSync(`${protocol}://*:${port}`);
    cb();
  }
}
