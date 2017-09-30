var Model = require('./models.js')

class Links extends Model {
	constructor() {
		super('links')
	}

	generateSlug() {
		var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
		var slug = '';
		for (var i = 0; i < 5; i++) {
			var index = Math.floor(Math.random() * 52);
	    slug += letters[index];
		}
	  return slug;
	}

	slugAlreadyExists(slug) {
		return this.get({slug: slug})
		  .then(links => {
		  	console.log('links :', links);
		  	if (links.length) {
		  		console.log("exists already")
		  		return true;
		  	} else {
		  		console.log("doesn't exist")
		  		return false;
		  	}
		  })
	}
}


module.exports = new Links();

