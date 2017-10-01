var expect = require('chai').expect;
var mysql = require('mysql');
var request = require('request');
var httpMocks = require('node-mocks-http');

var app = require('../server/index.js');
var schema = require('../server/db/tables.js');
var port = 4568;


describe('', function() {
	var db;
	console.log('describing')


	var clearDB = function(connection, tablenames, done) {
		var count = 0;
		for (var i = 0; i < tablenames.length; i++) {
			connection.query(`drop table if exists ${tablenames[i]}`, function() {
				count++;
				if (count === tablenames.length) {
					return schema(connection).then(done);
				}
			})
		}
	}

	beforeEach(function(done) {
    db = mysql.createConnection({
    	user: 'root',
    	password: '',
    	database: 'url'
    })

    db.connect(function(err) {
    	if (err) {
    		return done(err);
    	}
	    var tablenames = ['users', 'links']
	    clearDB(db, tablenames, function() {
	    	server = app.listen(port, done)
	    })	
    })
	})

	 describe('Database Schema:', function() {
    it('contains a users table', function(done) {
      var queryString = 'SELECT * FROM users';
      db.query(queryString, function(err, results) {
        if (err) { return done(err); }

        expect(results).to.deep.equal([]);
        done();
      });
    });
  })

	 
})