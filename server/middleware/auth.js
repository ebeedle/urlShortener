var sessions = require('../models').sessions;
var Promise = require('bluebird');

var createSession = (req, res, next) => {
	var agent = req.get('User-Agent');

	Promise.resolve(req.cookies.url)
	  .then(cookie => {
      if (!cookie) {
      	throw cookie;
      }
      
      return sessions.get({hash: cookie})
	  })
	  .tap(session => {
      if (!session) {
      	throw session;
      }

      if (!sessions.compare(agent, session[0].hash, session[0].salt)) {
      	return sessions.delete({ hash: session[0].hash }).throw(agent);
      }
	  }) 
	  .catch(() => {
	  	return sessions.create(agent)
	  	  .then(results => {
	  	    return sessions.get({id: results.insertId})
	  	  })
	  	  .tap(session => {
	  	  	res.cookie('url', session[0].hash)
	  	  })
	  })

	  .then(session => {
	  	req.session = session[0]
	  	next()
	  })

}

module.exports = createSession;

