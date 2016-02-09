var registry = require('../lib/registry.js');

describe('register', () => {
  beforeEach( () => {
    registry.clear();
  })
  describe('not valid service object', () => {
    it('should not be added to registry', () => {
      registry.register({});
      registry.registry().should.be.empty();
    })
  })
  describe('service with same name', () => {
    it('should replace the last one added', () => {
      registry.register({
        name: "name",
        hostname: "localhost",
        port: 3000,
        protocol: "youpi"
      })
      registry.registry().should.have.length(1);
      registry.register({
        name: "name",
        hostname: "localhost",
        port: 3000,
        protocol: "youpi"
      })
      registry.registry().should.have.length(1);
    })
  })
})
