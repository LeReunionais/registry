var http_app = require('./lib/interface/http.js')
  , puller = require('./lib/interface/puller.js')
  , publisher = require('./lib/interface/publisher.js')
  , responder = require('./lib/interface/responder.js');

var log = require('bunyan').createLogger({name:"registry"});

var HTTP_PORT = process.env.REGISTRY_HTTP_PORT || 3000;
http_app.listen(HTTP_PORT, () => {
  log.info(`HTTP listening on http://xxxx:${HTTP_PORT}`);
});

var PULLER_PORT = process.env.REGISTRY_PULLER_PORT || 3001;
puller.bind('tcp', PULLER_PORT, () => {
  log.info(`Pulling on tcp://xxxx:${PULLER_PORT}`);
});

var RESPONDER_PORT = process.env.REGISTRY_RESPONDER_PORT ||3002;
responder.bind('tcp', RESPONDER_PORT, () => {
  log.info(`Responding on tcp://xxxx:${RESPONDER_PORT}`);
});

var PUBLISHER_PORT = process.env.REGISTRY_PUBLISHER_PORT || 3003;
publisher.bind('tcp', PUBLISHER_PORT, () => {
  log.info(`Publishing on tcp://xxxx:${PUBLISHER_PORT}`);
});

responder.on(responder.SERVICE_NOT_FOUND, (service_name) => {
  log.info('Service not found: ', service_name, ' | Send publication to find this service');
  publisher.whois(service_name);
});

puller.on('NEW_SERVICE', (service_name) => {
  log.info('New service registered: ', service_name, ' | Alerting responder of this new discovery.');
  responder.emit(service_name + '_found');
});
