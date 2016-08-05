var should = require('should'),
  webhookSignatureValidator = require('./index');

describe('github webhook payload validator', () => {

  before(() => {});

  after(() => {});

  it('Request should contain x-hub-signature header', (done) => {
    var request = {
        headers: {}
      },
      response = {},
      instance = new webhookSignatureValidator('mysecret');

    instance.validateMD5Signature(request, response, (err) => {
      should.exist(err);
      err.message.should.be.equal("Request does not contain 'x-hub-signature' header.");
      done();
    });
  });

  it('Request should contain payload', (done) => {
    var request = {
        headers: {
          'x-hub-signature': "sha1='something'"
        }
      },
      response = {},
      instance = new webhookSignatureValidator('mysecret');

    instance.validateMD5Signature(request, response, (err) => {
      should.exist(err);
      err.message.should.be.equal("Request does not contain a payload.");
      done();
    });
  });

  it("Can calculate MD5 Signature Hash", (done) => {
    var request = {
        headers: {
          'x-hub-signature': "sha1=bbb637d549db84cb2f1bbf28053af0eac34086e0"
        },
        body: {
          id: "15"
        }
      },
      response = {},
      instance = new webhookSignatureValidator('mysecret');
    instance.validateMD5Signature(request, response, (err) => {
      should.not.exist(err);
      done();
    });
  });
});
