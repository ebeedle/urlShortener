var mysql = require('mysql');
var Promise = require('bluebird');
// var database = 'url';
var database = 'heroku_3f1609eae4480ef';
var createTables = require('./tables.js');

// var db_configOld = {
//   user: 'root',
//   password: '',
//   database: database
// }

var db_configNew = {
    host: 'us-cdbr-iron-east-05.cleardb.net',
    user: 'baef29c0c40879',
    password: 'd2bafb07',
    database: database
};



const connection = mysql.createConnection(db_configNew)

const db = Promise.promisifyAll(connection, {multiArgs: true})

db.connectAsync()
  .then(() => db.queryAsync(`create database if not exists ${database}`))
  .then(() => db.queryAsync(`use ${database}`))
  .then(() => createTables(db))
  .catch(err => console.log('error :', err))


module.exports = db;