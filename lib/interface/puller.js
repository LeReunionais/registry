var registry = require('../registry.js')
  , jsonrpc = require('../jsonrpc/jsonrpc.js')
  ;

var log = require('bunyan').createLogger({name:"registry/puller"});

var zmq = require('zmq')
  , pullSocket = zmq.socket('pull');

pullSocket.on('message', (msg) => {
  const message = JSON.parse(msg.toString());
  if (jsonrpc.validate(message)) {
    log.info("received", {message});
    switch(message.method) {
      case 'register':
        const new_service = message.params.service;
        log.info('New service: %s', {new_service});
        registry.register(new_service);
        pullSocket.emit('NEW_SERVICE', new_service.name);
      break;
      default:
        log.warn('Unknown method: %s', message.method);
    }
  } else {
    log.error('%s is not a valid json rpc message', msg.toString());
    log.error(jsonrpc.validate(message).message);
  }
});

module.exports = {
  bind: (protocol, port, cb) => {
    pullSocket.bindSync(`${protocol}://*:${port}`);
    cb();
  },
  on: (event, cb) => {
    pullSocket.on(event, cb);
  }
}
