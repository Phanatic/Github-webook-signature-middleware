var crypto = require('crypto');

function GithubMD5SingatureValidator(secret) {
  this.secret = secret;
  var self = this;

  this.validateMD5Signature = function validateMD5Signature(req, res, next) {
    var payloadSHA1Signature = req.headers['x-hub-signature'],
      payload = req.body,
      calculatedSignature, hmac;

    if (!payloadSHA1Signature) {
      return next(new Error("Request does not contain 'x-hub-signature' header."));
    }

    if (!payload) {
      return next(new Error("Request does not contain a payload."));
    }

    hmac = crypto
      .createHmac('sha1', self.secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    calculatedSignature = `sha1=${hmac}`;
    if (calculatedSignature === payloadSHA1Signature) {
      return next();
    }

    console.log(calculatedSignature);
    return next(new Error("Bad Request. MD5 signature validation failed."));
  };
}

module.exports = GithubMD5SingatureValidator;
