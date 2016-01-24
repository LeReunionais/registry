var jsonrpc = require('../../lib/jsonrpc/jsonrpc.js');

describe('validate', () => {
  it('should return false  and error reason why if it is not a valid json rpc message', () => {
    var notRPC = {};
    jsonrpc.validate(notRPC).valid.should.be.false();
  })
  it('should return true if is a a valid json rpc messge', () => {
    var validRPC = {
      id: "unique_id",
      method: "action",
      params: {},
      jsonrpc: "2.0"
    }

    jsonrpc.validate(validRPC).valid.should.be.true();
  })
})
