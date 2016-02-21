#!/usr/bin/env node
var zmq = require('zmq')
  , pusher = zmq.socket('push')
  , requester = zmq.socket('req')
  , subscriber = zmq.socket('sub')
  , program = require('commander')
  ;

program
  .version('0.0.1')
  .option('-s, --subscribe', 'Launch a subscription for registration call publication.')
  .option('-H, --host [host]', 'Registry host', '127.0.0.1')
  .option('-P, --push [push]', 'Registry push port', '3001')
  ;

program
  .command('register')
  .description('Register a service. Default: { "name": "youpi", "protocol": "PUSH", "port": 3002, "hostname": "127.0.0.1" }')
  .option('-s, --service <service>', 'Name of the service')
  .option('-H, --hostname <hostname>', 'Hostname')
  .option('-p, --port <port>', 'Port', parseInt)
  .option('-pt, --protocol <protocol>', 'Protocol')
  .action( doRegister )
  ;

program
  .command('find')
  .description('Find a service. Default: youpi')
  .option('-s, --service <service>', 'Name of the service we are looking for')
  .action( doFind )
  ;

program
  .command('invalidate [service_name]')
  .description('Remove a service from registry.')
  .action( doInvalidate )
  ;

program.parse(process.argv);
const push_port = program.push || 3001;

if (program.subscribe) {
  subscriber.connect('tcp://' + program.host + ':3003');
  subscriber.subscribe('');
  console.log('Subscribed port 3003');
  subscriber.on('message', (message) => {
    console.log('Received publication: ', message.toString());
    doRegister({});
  });
}

function doInvalidate(service_name) {
	console.log('Command: invalidate an existing service');
	const connection_string = 'tcp://' + program.host + ':' + program.push;
	console.log(connection_string);
	pusher.connect(connection_string);
	console.log('Pusher connected to port ' + push_port);
	console.log('Trying to invalidate: ', service_name);
	const invalidate_object = {
		id: "client",
		jsonrpc: "2.0",
		method: 'invalidate',
		params: {
			name: service_name
		}
	}
	pusher.send(JSON.stringify(invalidate_object));
	pusher.close();
}
function doFind(options) {
    console.log(program.host);
    requester.connect('tcp://' + program.host + ':3002');
    console.log('Requester connected to port 3002');
    const requester_object = {
      method: 'find',
      params: {
        service: { name: options.service || 'youpi' }
      }
    };
    requester.send(JSON.stringify(requester_object));
    requester.on('message', (message) => {
      console.log('Got service', message.toString());
    });
}

function doRegister(options) {
    console.log('Command: register a new service');
    const service = {
      name: options.service || 'youpi',
      hostname: options.hostname || '127.0.0.1',
      port: options.port || 3002,
      protocol: options.protocol || 'PUSH'
    }
    pusher.connect('tcp://'+ program.host + ':' + program.push);
    console.log('Pusher connected to port ' + program.push);
    const register_object = {
      id: "client",
      jsonrpc: "2.0",
      method: 'register',
      params: {
        service
      }
    }
    console.log('Trying to register: ', service);
    pusher.send(JSON.stringify(register_object));
    pusher.close();
}
