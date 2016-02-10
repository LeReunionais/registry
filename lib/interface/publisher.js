var zmq = require('zmq')
  , publisher = zmq.socket('pub');
var log = require('bunyan').createLogger({name:"registry/publisher"});

module.exports = {
  bind: (protocol, port, cb) => {
    publisher.bindSync(`${protocol}://*:${port}`);
    cb();
  },
  whois: (service_name) => {
    log.info('Who is: ', service_name, "?");
    publisher.send(JSON.stringify({ service: {name: service_name} }));
  }
}
