var Model = require('./models.js');
var utils = require('../lib/hashUtils.js')

class Users extends Model {
	constructor() {
		super('users');
	}

	createHashandSalt(password) {
    var salt = utils.createSalt();
    var hash = utils.createHash(password, salt)
    return {
    	salt: salt,
    	hash: hash
    }
	}
}

// module.exports = new Users();


// var x = module.exports.createHashandSalt('bob')

// console.log('x :', x);