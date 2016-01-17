var http_app = require('./lib/interface/http.js')
  , puller = require('./lib/interface/puller.js')
  , publisher = require('./lib/interface/publisher.js')
  , responder = require('./lib/interface/responder.js');

var HTTP_PORT = 3000;
http_app.listen(HTTP_PORT, () => {
  console.log(`HTTP listening on http://xxxx:${HTTP_PORT}`);
});

var ZMQ_PULL_PORT = 3001;
puller.bind('tcp', ZMQ_PULL_PORT, () => {
  console.log(`Pulling on tcp://xxxx:${ZMQ_PULL_PORT}`);
});

var RESPONDER_PORT = 3002;
responder.bind('tcp', RESPONDER_PORT, () => {
  console.log(`Responding on tcp://xxxx:${RESPONDER_PORT}`);
});

var PUBLISHER_PORT = 3003;
publisher.bind('tcp', PUBLISHER_PORT, () => {
  console.log(`Publishing on tcp://xxxx:${PUBLISHER_PORT}`);
});

responder.on('service not found', (service_name) => {
  publisher.whois(service_name);
});
