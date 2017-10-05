module.exports.parseCookies = (req, res, next) => {
	var cookies = req.get('Cookie');
	var parsedCookies = {};
	if (cookies && cookies.indexOf('; ') !== -1) {
		cookieArray = cookies.split('; ');
		for (var i = 0; i < cookieArray.length; i++) {
			if (cookieArray[i].indexOf('=') > -1) {
				var cookieKey = cookieArray[i].split('=')[0]
				var cookieVal = cookieArray[i].split('=')[1]
				parsedCookies[cookieKey] = cookieVal;
			}
		}
	}
	
	req.cookies = parsedCookies;

	next()
}

//take request
  //get cookieString
  //parse string
  //put cookies into an object
  //attach cookie object to request object
  //next()