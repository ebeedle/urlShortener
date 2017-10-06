var ob = 'hi';
var port = 5000 || 3000;
var url1 = `localhost:${port}`;
var url2 = `urlshortener4.herokuapp.com/`;
console.log('port :', port);

var getUrl = function(url) {
  window.location.href = url;
}
$(document).ready(() => {

//on form's submit, make post request to server, change name
 
 $('#link').on("submit", (e) => {
 	$("#slugs").empty();
 	console.log('sumbitging');
 	 var longLink = $('#text').val();
 	 var longLink = {longLink: longLink};
	 $.ajax({
	      type: 'POST',
	      url: `http://${url2}/createHash`,
	      data: longLink
	    })
	    .done((user) => {
	    	console.log('urser ', user);
	    	var url = `http://localhost:3000/${user}`
	    	console.log('typeof', typeof user);
	    	$('#slugs').append(`<div> Your shortened URL is <span style="color: blue; text-decoration: underline; cursor: pointer" onClick="getUrl('${url}')"> http://localhost:3000/${user} </span> </div>`)
	    });
  e.preventDefault(e);
 })

 // $('span').on("click", (e) => {
 // 	alert('clicked')
 // 	 $.ajax({
	//       type: 'GET',
	//       url: $('span').text(),
	//     })
 //  })
})
