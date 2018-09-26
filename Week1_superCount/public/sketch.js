var app = {
	youtubeURL: 'https://youtube-sub--chelseachenc.repl.co/?url=',

	initialize: (()=> {
		//Use jQuery to assign a callback function when the 'search' button is clicked
		$("#submit").click(function () {
			console.log("load");
			//Clear the div
			$("#right").html("");
			//Use jQuery to get the value of the 'query' input box
			var videoURL = $("#query").val();
			console.log(videoURL);
			//Execute the Wikipedia API call with the 'newSearchTerm' string as its argument 
			app.counting(videoURL);
		});
	}),

	counting: function (videoURL) {
		$.ajax({
			url: this.youtubeURL + videoURL,
			type: 'GET',
			dataType: 'jsonp',
			error: function (data) {
				console.log("We got problems");
				//console.log(data.status);
			},
			success: function (data) {
				// debugger;
				console.log("WooHoo!");
				//Check the browser console to see the returned data


				$('#results tr + tr').remove();

				//Loop through the array of results
				for (var i = 0; i < data.length; i++) {
				// for (var i = 0; i < 20; i++) {	
					var htmlString = "<tr>" +
						"<th scope='row'>" + (i + 1) + "</th>" +
						"<td>" + data[i][0] + "</td>" +
						"<td>" + data[i][1] + "</td>" +
						"</tr>";
					//Use jQuery's append() function to add the searchResults to the DOM
					$('#results tr:last').after(htmlString);
				}
			}
		});
	}
}