// const dotenv = require('dotenv')
// const result = dotenv.config()
// if (result.error) {
//   throw result.error
// }
const express = require('express');
const path = require('path');
let app = express();
var bodyParser = require('body-parser');
var models = require('./models');
 
 
// console.log('parsed :', result.parsed)
// console.log('processs env 2 :', process.env.DB)

// var redis = require('redis');
// var client = redis.createClient();
var utils = require('./lib/hashUtils.js')

// client.on('connect', function() {
//     console.log('connected');
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(function (req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=5')
    next();
});

function cache(req, res, next) {  
    //  var slug = req.params.slug;
    //  client.get(slug, function (err, destination) {
    //     if (err) throw err;

    //     if (destination != null) {
    //         console.log(`utilizing redis slug : ${slug} destination : ${destination}`);
    //         res.redirect(destination)
    //     } else {
    //         req.noRedis = true;
            next();
    //     }
    // });
}

app.get('/', (req, res) => {
  console.log('home page loading')
	res.sendFile(path.join(__dirname, '../client/home/index.html'));
})

app.get('/portal', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/portal.html'));
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/login.html'));
})

app.post('/login', (req, res) => {
  var inputtedPassword = req.body.password;
  var email = req.body.email;
  models.users.get({email : email})
    .then(user => {
      if (!user.length) {
        res.redirect('/signup')
      } else {  
        var usersPassword = user[0].password;
        var usersSalt = user[0].salt;
        var correctPassword = utils.compareHash(inputtedPassword, usersPassword, usersSalt);
        if (correctPassword) {
          return res.redirect('/portal');
        } else {
          return res.redirect('/login')
        }
      }
    })
    .catch(err => {
      console.log('error :', err);
      res.redirect('/login')
    })
})

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/signup.html'))
})

app.post('/signup', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var hashAndSalt = utils.createHashandSalt(password);
  var hash = hashAndSalt.hash;
  var salt = hashAndSalt.salt;

  models.users.create({email: email, password: hash, salt: salt})
    .then(() => res.redirect('/login'))
    .catch(err => {
      console.log('error :', err)
      res.redirect('/signup')
    })
})

app.get('/styles.css', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/styles.css'));
})

app.get('/app.js', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/home/app.js'));
})

app.post('/createHash', (req, res) => {
  console.log('gneerating....')
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
    console.log('slug :', slug);
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
        //  if (req.noRedis) {
        //   client.setex(slug, 30, destination);  
        // }
        res.redirect(destination)
      } else {
        throw slug;
      }
    })
    .catch(err => {
      res.send('No known url is assocaited with that address')
    })
})

module.exports = app;

// app.listen(3000, () => {
// 	console.log('Listening on port 3000');
// })