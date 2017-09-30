const express = require('express');
const path = require('path');
let app = express();
// let selectAll = require('../db/db.js').selectAll;
// let Link = require('../db/db.js').Link;
var bodyParser = require('body-parser');
// var generateSlug = require('../models/models.js')
var models = require('./models');

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
            // respondes.send(respond(org, data));
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
  	var slug = models.links.generateSlug();
    models.links.slugAlreadyExists(slug)
      .then(answer => {
        if (answer === true) {
          generateAndCheck(callback)
        } else {
          callback(slug);
        }
      })
      .catch(err => console.log(err))
  }

  generateAndCheck(slug => {
    models.links.create({destination: destination, slug: slug})
      .then(() => res.send(slug))
      .catch(err => console.log(err))
  })
});


app.get('/:slug', cache, (req, res) => {
  console.log("REDIS WAS NOT USED")
  var slug = req.params.slug;

  models.links.get({slug: slug})
    .then(link => {
      if (link.length) {
        var destination = link[0].destination;
         if (req.noRedis) {
          client.setex(slug, 30, destination);  
        }
        res.redirect(destination)
      } else {
        throw slug;
      }
    })
    .catch(err => {
      res.send('No known url is assocaited with that address')
    })
})


app.listen(3000, () => {
	console.log('Listening on port 3000');
})