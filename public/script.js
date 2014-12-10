$(function(){

//DELETE BUTTON
$('.delete').on('click', function(event){
		// alert('Hello')
		event.preventDefault();
		var thisDeleteButton = $(this);

		$.ajax({
			url:'/watchlist/'+thisDeleteButton.data('id'),
			type:'DELETE',
			success:function(result) {
				thisDeleteButton.closest(".watchlistItem").fadeOut('slow', function(){
					$(this).remove();
				})
			}
		})
	})

$(".addButton").on("click", function(event){
		alert("Hello")
		var theButton = $(this);
		event.preventDefault();
		var thisAddButton = $(this);

		$.post("/watchlist", {	
			movie_title: thisAddButton.data("movie_title"),
			year: thisAddButton.data("year"),
			imdb_code: thisAddButton.data("imdb")
		}, function(data) {
			alert("Movie has been added!");
			theButton.closest(".addButton").slideUp("slow", function(){
				$(this).remove();
			})
		});
	});

});

