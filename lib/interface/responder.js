var registry = require('../registry.js')
  , jsonrpc = require('../jsonrpc/jsonrpc')
	, jsonrpclite = require('jsonrpc-lite')
  ; 

var log = require('bunyan').createLogger({name:"registry/responder"});

var zmq = require('zmq')
  , responder = zmq.socket('rep');

var SERVICE_NOT_FOUND = 'SERVICE_NOT_FOUND';

function find(service_to_find) {
  return new Promise ( (resolve) => {
    const result = registry.find(service_to_find);
    if (result !== undefined) {
      log.info('Service found');
      resolve(result);
    } else {
      log.info('Not able to find service: %s', service_to_find);
      responder.emit(SERVICE_NOT_FOUND, service_to_find);
      responder.once(service_to_find + "_found", () => {
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
        find(message.params)
				.then( service => JSON.stringify(service))
				.then( service_json => jsonrpclite.success(message.id, service_json) )
        .then( response_json => responder.send(response_json));
      break;
      default:
      log.info('Unknown action: %s', message.method);
      responder.send(jsonrpclite.error( message.id, new jsonrpclite.JsonRpcError("Unknown action. Supported action: [find]")));
    }
  } else {
		var error = msg.toString + ' is not a valid json rpc message';
    log.error(error);
    log.error(jsonrpc.validate(message).message);
		responder.send(jsonrpclite.error( message.id, new jsonrpclite.JsonRpcError( error )));
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
