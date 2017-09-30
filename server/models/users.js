var Model = require('./models.js');

class Users extends Model {
	constructor() {
		super('users');
	}
}

module.exports = new Users();