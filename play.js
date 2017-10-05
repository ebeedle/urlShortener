var httpMocks = require('node-mocks-http');
var parseCookies = require('./server/middleware/cookieParser.js').parseCookies;
var createSession = require('./server/middleware/auth.js')
var Promise = require('bluebird');
var db = require('./server/db/index.js');

var cookie = "url=GH1.1.2108095027.1506368110; _gat=1; _ga=GA1.2.83082626.1506368110; tz=America%2FLos_Angeles"
var nocookies = '';
var req = httpMocks.createRequest({
	headers : {
		Cookie: cookie
	}
})

// Promise.resolve('hi')
//   .then(() => {
//   	parseCookies(req, {}, )
//   }


// parseCookies(req, 'hi', () => createSession(req));


        var requestWithoutCookie = httpMocks.createRequest();
        var response = httpMocks.createResponse();
        var username = 'BillZito';

        db.query('INSERT INTO users (email) VALUES (?)', username, function(error, results) {
          if (error) { return error; }
          var userId = results.insertId;

          createSession(requestWithoutCookie, response, function() {
            var hash = requestWithoutCookie.session.hash;
            db.query('UPDATE sessions SET user_id = ? WHERE hash = ?', [userId, hash], function(error, result) {

              var secondResponse = httpMocks.createResponse();
              var requestWithCookies = httpMocks.createRequest();
              requestWithCookies.cookies.url = hash;

              createSession(requestWithCookies, secondResponse, function() {
                var session = requestWithCookies.session;
                console.log('session :', session)
                
              });
            });
          });
        });

// console.log('req.cookies', req.cookies);