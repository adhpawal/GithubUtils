$(document).ready(function(){
	var SAVE_FILTER_DATA="saveFilterData";
	var OKAY="ok";
	//add filter-button click listener.
	//Store the filter values in chrome storage via message to 
	$('#filter-button').click(function(){
		var filterPages=$('#filterArea').val();
		chrome.runtime.sendMessage({action:SAVE_FILTER_DATA, data:filterPages},function(response){
		  if(response){
		  	if(response.status==OKAY){
		  		$('#message-text').text("Entry saved successfully.").css("color","green").show();
		  	}
		  	else{
		  		$('#message-text').text("Entry save failed.").css("color","red").show();
		  	}
		  }
		  else{
		  	$('#message-text').text("Entry save failed.").css("color","red").show();
		  }
		});
	});
});