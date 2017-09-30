var db = require('../db/index.js')

var reduceOb = (options, cb, start) => {
	var keys = Object.keys(options);
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var val = options[keys[i]];
			start = cb(start, val, key);
	}
	return start;
}

var parseObj = (ob) => {
	return reduceOb(ob, (acc, val, key) => {
	  acc.vals.push(val);
	  acc.keys.push(`${key} = ?`);
	  return acc;
  }, {vals: [], keys: []})
}


class Model {
	constructor(table) {
		this.table = table;
	}
  getAll() {
  	var query = `select * from ${this.table}`
  	return db.queryAsync(query).spread(data => data)
  }
	get(params) {
		var specifications = parseObj(params);
		var values = specifications.vals;
		var str = specifications.keys.join(' AND ');
		var query = `select * from ${this.table} where ${str}`;
		return db.queryAsync(query, values).spread(data => data)
	}

	create(options) {
		var query = `insert into ${this.table} set ?`;
		return db.queryAsync(query, options).spread(data => data)
	}

  update(options, values) {
    let parsedOptions = parseObj(options);
    let queryString = `UPDATE ${this.table} SET ? WHERE ${parsedOptions.keys.join(' AND ')}`;
    return db.queryAsync(queryString, Array.prototype.concat(values, parsedOptions.vals)).spread(data => data)
  }

  delete(options) {
  	let parsedOptions = parseObj(options);
  	let query = `delete from ${this.table} where ${parsedOptions.keys.join(' and ')}`
  	console.log("query ", query);
  	console.log("parsedOptionsvals :", parsedOptions.vals)
  	return db.queryAsync(query, parsedOptions.vals).spread(data => data)
  }

  deleteAll() {
  	var query = `truncate ${this.table}`;
  	return db.queryAsync(query).spread(data => data)
  }

}

module.exports = Model

// var n = new module.exports('users');

// n.update({email: 'gsldkfj'}, {email: 'updatedemail'})
// .then(data => console.log(data)) 

// var m = new Model('users');

// m.update({id: 2}, {password: 'hello'})
// .then(x => console.log(x));
// var courses = new Model('courses');
// var users = new Model('users');

// users.deleteAll()
// .then(x => {
// 	console.log('x :', x[0])
// })
// .catch(err => {
// 	console.log(err);
// })

