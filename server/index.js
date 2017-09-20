const express = require('express');
const path = require('path');
let app = express();
let selectAll = require('../db/db.js').selectAll;
let Link = require('../db/db.js').Link;
var bodyParser = require('body-parser');
var generateSlug = require('../models/models.js')

var redis = require('redis');
var client = redis.createClient(); //creates a new client

client.on('connect', function() {
    console.log('connected');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(function (req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=5')
    next();
});

function cache(req, res, next) {  
     var slug = req.params.slug;
    client.get(slug, function (err, destination) {
        if (err) throw err;

        if (destination != null) {
            console.log(`utilizing redis slug : ${slug} destination : ${destination}`);
            res.redirect(destination)
            // res.send(respond(org, data));
        } else {
            req.noRedis = true;
            next();
        }
    });
}

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/home/index.html'));
})

app.get('/styles.css', (req, res) => {
	// app.set('etag', false)
	//check if etag same as previous, if so, send file,
	//if not, don't send file. 
	res.sendFile(path.join(__dirname, '../client/styles.css'));
})

app.get('/app.js', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/home/app.js'));
})

app.post('/createHash', (req, res) => {
  var destination = req.body.longLink;
  
  var generateAndCheck = (callback) => {
  	var slug = generateSlug()
  	selectAll((err, data) => {
  		if (err) {
  			throw err;
  		}

  		for (var i = 0; i < data.length; i++) {
  			if (data.slug === slug) {
  				return generateAndCheck(callback);
  			} 
  		}
  		return callback(slug);
  	})
  }

  generateAndCheck(slug => {
  	console.log('slug !!!!!', slug);
  	var link = new Link({ slug: slug, destination: destination});
		link.save(function (err, bob) {
			console.log('saving')
		  if (err) return console.error(err);
      // client.setex(slug, 15, destination);  
		  res.send(slug);
		});
  })
});


app.get('/:slug', cache, (req, res) => {
  console.log("REDIS WAS NOT USEDDDDDDDD")
  var slug = req.params.slug;

  selectAll((err, data) => {
  	if (err) {
  		throw err;
  	}
  	for (var i = 0; i < data.length; i++) {
  		if (data[i].slug === slug) {
        if (req.noRedis) {
          client.setex(slug, 30, data[i].destination);  
        }
  			return res.redirect(data[i].destination)
  		}
  	}
  	res.redirect('/')
  })
})



app.listen(3000, () => {
	console.log('Listening on port 3000');
})


// selectAll((err, data) => {
//  if (err) {
//    throw err;
//  }

//  console.log('data :', data);
// })
// var bob = new Kitten({ name: 'b' });

// bob.save(function (err, bob) {
//  console.log('saving')
//   if (err) return console.error(err);
//    selectAll((err, kittens) => {
//      if (err) {
//        console.log(err)
//      } else {
//        console.log('kittens:', kittens)
//      }
//    })
// });

//create home page, serve up index.html


  // Kitten.find(function (err, kittens) {
  //  console.log('findingonindex');
  //   if (err) return console.error(err)
  //   console.log(kittens);
  // })
// let Kitten = require('./db.js').Kitten

 // var kittySchema = mongoose.Schema({
 //    name: String
 //  });

 //  var Kitten = mongoose.model('Kitten', kittySchema);

//   var silence = new Kitten({ name: 'Silence' });
// console.log(silence.name); // 'Silence'

// kittySchema.methods.speak = function () {
//   var greeting = this.name
//     ? "Meow name is " + this.name
//     : "I don't have a name";
//   console.log(greeting);
// }

// var Kitten = mongoose.model('Kitten', kittySchema);

// var bob = new Kitten({ name: 'bob' });
// // bob.speak(); // "Meow name is bob"


// bob.save(function (err, bob) {
//   if (err) return console.error(err);
//   // bob.speak();
// });

// Kitten.find(function (err, kittens) {
//   if (err) return console.error(err)
//   console.log(kittens);
// })
// console.log(`kitten : ${Kitten}`)


// Kitten.find(function (err, kittens) {
//   if (err) return console.error(err)
//   console.log(kittens);
// })
