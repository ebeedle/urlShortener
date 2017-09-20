var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('working!!!!! db connected')
})

  
var linkSchema = mongoose.Schema({
  slug: String,
  destination: String
});

var Link = mongoose.model('Link', linkSchema);

// Link.remove({}, function (err) {
//   if (err) return handleError(err);
//   // removed!
// });

//   var silence = new Kitten({ name: 'Silence' });
// console.log(silence.name); // 'Silence'

// kittySchema.methods.speak = function () {
//   var greeting = this.name
//     ? "Meow name is " + this.name
//     : "I don't have a name";
//   console.log(greeting);
// }

// var Kitten = mongoose.model('Kitten', kittySchema);

// var link = new Link({ slug: 'abc', destination: 'http://www.yahoo.com'});
// // // bob.speak(); // "Meow name is bob"


// link.save(function (err, bob) {
// 	console.log('saving')
//   if (err) return console.error(err);
//   // bob.speak();
// });

	var selectAll = (callback) => {
		Link.find({}, (err, items) => {
			if (err) {
				callback(err, null)
			} else {
				callback(null, items);
			}
		})
	}

module.exports.selectAll = selectAll;
module.exports.Link = Link;


//	 module.exports.Kitten = db


