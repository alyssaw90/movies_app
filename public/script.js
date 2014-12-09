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
		thisDeleteButton.closest(".watchlistItem").slideUp('slow', function(){
			$(this).remove();
			})
		}
	})
	})
});