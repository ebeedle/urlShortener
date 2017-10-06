var app = require('./index.js');
var port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
})

//create sessions table

//store random cookie as sessionID

//on signup/login, store cookie as sessionID in 
//sessions table, and link that sessionID to user'sID

//onEach subsequent reqeust, check to see if cookie
//corresponds to any session id in table. 

