var db = require('./index.js');
var Promise = require('bluebird');
var createTables = db => {
	if (!db.queryAsync) {
			db = Promise.promisifyAll(db);
	}
	return db.queryAsync(`create table if not exists users (
		id int not null auto_increment primary key,
		email varchar(100),
		password varchar(100),
		salt varchar(100)
	);`
	)
  .then(() => {
  	return db.queryAsync(`create table if not exists links (
			id int not null auto_increment primary key,
			slug varchar(50),
			destination varchar(300)
		);`
  )
  })
}

module.exports = createTables;