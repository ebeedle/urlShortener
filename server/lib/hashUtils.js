const crypto = require('crypto');

exports.createHash = (data, salt) => {
  let shasum = crypto.createHash('sha256');
  shasum.update(data + salt);
  return shasum.digest('hex');
};

exports.compareHash = (attempted, stored, salt) => {
  return stored === this.createHash(attempted, salt);
};

exports.createSalt = () => {
  return crypto.randomBytes(32).toString('hex');
};

exports.createHashandSalt = password => {
  var salt = exports.createSalt();
  var hash = exports.createHash(password, salt);
  return {
  	salt: salt,
  	hash: hash
  }
}