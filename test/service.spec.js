var service = require('../lib/service.js');

describe('First test', () => {
  it('should be successfull', () => {
    (true).should.be.True();
  });
});

describe('service', () => {
  describe('validate', () => {
    const validService = {
        name: "youpi",
        hostname: "127.0.0.1",
        port: 3000
    }
    it('should return false if object does not contain valid name', () => {
        var nameIsArray = Object.assign(validService, {
          name: []
        });
        service.validate(nameIsArray).should.be.False();

        var nameIsNumber = Object.assign(validService, {
          name: 123
        });
        service.validate(nameIsNumber).should.be.False();
    });
    it('should return false if object does not contain valid host', () => {
        var hostnameIsArray = Object.assign(validService, {
            hostname: [123]
        });
        service.validate(hostnameIsArray).should.be.False();

        var hostnameIsNumber = Object.assign(validService, {
            hostname: 123
        });
        service.validate(hostnameIsNumber).should.be.False();
    });
    it('should return false if object does not contain valid port', () => {
        var portIsArray = Object.assign(validService, {
            port: [123]
        });
        service.validate(portIsArray).should.be.False();

        var portIsString = Object.assign(validService, {
            port: "123"
        });
        service.validate(portIsString).should.be.False();
      });
    it('should return true if object has: - a valid name - a valid hostname - a valid port - a valid protocol', () => {
      service.validate({
        name: "youpi",
        hostname: "127.0.0.1",
        port: 3000,
        protocol: "PUSH"
      }).should.be.True();
    })
  })
  describe('format', () => {
    it('should return object with undefined is mandatory attribute cannot be found', () => {
        service.format({
          name: "youpi",
          hostname: "127.0.0.1",
          port: 3000
        }).should.be.eql({
          name: "youpi",
          hostname: "127.0.0.1",
          port: 3000,
          protocol: undefined
        })
    })
    it('should return "clean" object with only necessary attributes', () => {
        service.format({
          name: "youpi",
          hostname: "127.0.0.1",
          port: 3000,
          protocol: "PUSH",
          unnecessary_attribute: "unecessary_value"
        }).should.be.eql({
          name: "youpi",
          hostname: "127.0.0.1",
          protocol: "PUSH",
          port: 3000
        })
    })
  })
})
