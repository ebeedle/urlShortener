var app = require('./index.js');

app.listen(3000, () => {
	console.log('Listening on port 3000');
})

//create sessions table

//store random cookie as sessionID

//on signup/login, store cookie as sessionID in 
//sessions table, and link that sessionID to user'sID

//onEach subsequent reqeust, check to see if cookie
//corresponds to any session id in table. 

