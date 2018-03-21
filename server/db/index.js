var mysql = require('mysql');
var Promise = require('bluebird');

let pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB
})

module.exports = {
    query: function(){
        var sql_args = [];
        var args = [];
        for(var i=0; i<arguments.length; i++){
            args.push(arguments[i]);
        }
        var callback = args[args.length-1];
         //last arg is callback
        pool.getConnection(function(err, connection) {
          
        if(err) {
                console.log(err);
                return callback(err);
            }
            if(args.length > 2){
                sql_args = args[1];
            }
        connection.query(args[0], sql_args, function(err, results) {
          connection.release(); // always put connection back in pool after last query
          if(err){
                    console.log(err);
                    return callback(err);
                }
          callback(null, [results]);
        });
      });
    }
};
    // queryAsync: function(){
    //     var sql_args = [];
    //     var args = [];
    //     for(var i=0; i<arguments.length; i++){
    //         args.push(arguments[i]);
    //     }
    //     var callback = args[args.length-1];
    //      //last arg is callback
    //     pool.getConnection(function(err, connection) {
    //     let queryAsync2 = Promise.promisify(connection.query);
  
    //     if(err) {
    //             console.log(err);
    //             return callback(err);
    //         }
    //         if(args.length > 2){
    //             sql_args = args[1];
    //         }
    //     connection.query(args[0], sql_args, function(err, results) {
    //       connection.release(); // always put connection back in pool after last query
    //       if(err){
    //                 console.log(err);
    //                 return callback(err);
    //             }
    //       callback(null, results);
    //     });
    //   });
    // }


// var database = 'url';

// var createTables = require('./tables.js');

// var db_configOld = {
//   user: 'root',
//   password: '',
//   database: database
// }
// console.log("DB ON!!!!!!!")
// var db_configNew = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB
// };



// const connection = mysql.createConnection(db_configNew)

// const db = Promise.promisifyAll(connection, {multiArgs: true})

// db.connectAsync()
//   .then(() => db.queryAsync(`create database if not exists ${database}`))
//   .then(() => db.queryAsync(`use ${database}`))
//   .then(() => createTables(db))
//   .catch(err => console.log('error :', err))


// module.exports = db;