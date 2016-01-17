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
})
