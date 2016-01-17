var zmq = require('zmq')
  , publisher = zmq.socket('pub');

module.exports = {
  bind: (protocol, port, cb) => {
    publisher.bindSync(`${protocol}://*:${port}`);
    cb();
  },
  whois: (service_name) => {
    console.log('Who is: ', service_name);
    publisher.send(JSON.stringify({ service: {name: service_name} }));
  }
}
