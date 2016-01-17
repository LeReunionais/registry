var registry = require('../registry.js');

var zmq = require('zmq')
  , pullSocket = zmq.socket('pull');

pullSocket.on('message', (msg) => {
  const message = JSON.parse(msg.toString());
  console.log(message);
  switch(message.action) {
    case 'register':
      const new_service = message.service;
      console.log('New service: %s', JSON.stringify(new_service));
      registry.register(new_service);
      break;
    case 'list':

      break;
    default:
      console.log('Unknown action: %s', message.action);
  }
});

module.exports = {
  bind: (protocol, port, cb) => {
    pullSocket.bindSync(`${protocol}://*:${port}`);
    cb();
  }
}
