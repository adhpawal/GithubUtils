$(document).ready(function(){
	var SAVE_FILTER_DATA="saveFilterData";
	var OKAY="ok";
	var OPEN_ISSUE_BOARD_PAGE="openIssueBoardPage";
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

	//Issue board button click event

	$('#board-button').click(function(){
		chrome.runtime.sendMessage({action:OPEN_ISSUE_BOARD_PAGE},function(){})
	});
	
	// Enable disable text area while choosing inclusive or exclusive option
	
	document.getElementById("exclusive").onclick=enable1;
	document.getElementById("inclusive").onclick=enable2;
	function enable1(){
		document.getElementById("filterArea1").disabled=false;
		document.getElementById("filterArea2").disabled=true;
	}
	function enable2(){
		document.getElementById("filterArea2").disabled=false;
		document.getElementById("filterArea1").disabled=true;
	}
	
});