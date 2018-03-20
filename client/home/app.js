var getUrl = function(url) {
  window.location.href = url;
}
$(document).ready(() => {

//on form's submit, make post request to server, change name
 
 $('#link').on("submit", (e) => {
 	$("#slugs").empty();
 	console.log('sumbitging');
 	 var longLink = $('#text').val();
 	 console.log('longLink :', longLink)
 	 var longLink = {longLink: longLink};
 	 console.log('longLink :', longLink)
	 $.ajax({
	      type: 'POST',
	      url: `/createHash`,
	      data: longLink
	    })
	    .done(slug => {
	    	console.log('slug ', slug);
	    	console.log('typeof', typeof slug);
	    	var destination = `${window.location.href}${slug}`
	    	$('#slugs').append(`<div> Your shortened URL is <span style="color: blue; text-decoration: underline; cursor: pointer" > <a href=${destination}> ${destination} </a> </span> </div>`)
	    })
	    .fail(e => console.log('e :', e))
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
