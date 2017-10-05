var Model = require('./models.js')
var utils = require('../lib/hashUtils.js')

class Sessions extends Model {
	constructor() {
		super('sessions');
	}

	compare(agent, hash, salt) {
    return utils.compareHash(agent, hash, salt)
	}

	create(agent) {
		console.log('called ');
		var salt = utils.createSalt();
		var hash = utils.createHash(agent, salt);
		return super.create.call(this, {salt: salt, hash: hash})
	}
}


module.exports = new Sessions()

// module.exports.get({hash: 'sdlkfjsdlkfj'})
// .then(x => console.log(x[0]))

