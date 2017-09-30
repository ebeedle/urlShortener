var mysql = require('mysql');
var Promise = require('bluebird');
var database = 'url'
var createTables = require('./tables.js');


const connection = mysql.createConnection({
	user: 'root',
	password: '',
	database: database
})

const db = Promise.promisifyAll(connection, {multiArgs: true})

db.connectAsync()
  .then(() => db.queryAsync(`create database if not exists ${database}`))
  .then(() => db.queryAsync(`use ${database}`))
  .then(() => createTables(db))
  .catch(err => console.log('error :', err))


module.exports = db;