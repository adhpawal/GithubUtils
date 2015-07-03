
var FILTER_STRING_KEY="filterString";
$(document).ready(function(){
	 var GET_FILTER_STRING="getFilterString";
	 var SAVE_FILTER_DATA="saveFilterData";
	 var OKAY="ok";
	//populate filter text area after page load.
	populateFilterTextArea();
	//add message listners
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
		console.log("request data for extension.js is : "+request);
		 if (request.action == "read_file"){
	 		$.ajax({
		        url: chrome.extension.getURL("swimlanes.html"),
		        dataType: "html",
		        success:function(html){
		        	console.log(html);
		        	sendResponse({page:html});
		        }
	   	 	});
		 }
		 //retrieve filter pages from chrome storage
		 else if(request.action==GET_FILTER_STRING){
		 	chrome.storage.sync.get([FILTER_STRING_KEY],function(data){
				if(data){
					filterString=data.filterString;
					sendResponse({filterString:filterString});
				}
			});
		 }
		 	//store in chrome sync. This will cause the data to sync over different chrome browser if the sync is enabled.
			//If sync is not enabled, it will work as local storage
		 else if(request.action==SAVE_FILTER_DATA){
		 	filterPages=request.data
		 	var valuePair={};
		 	valuePair[FILTER_STRING_KEY] =filterPages;
		 	chrome.storage.sync.set(valuePair, function() {
		 		if(chrome.runtime.lastError){
		 			sendResponse({status:chrome.runtime.lastError.message});
		 		}
		 		sendResponse({status:OKAY});
				   
	        });
		 }
		 return true;
	});

});


//Method to get filter string from chrome storage
//@author nimesh
function getFilterStringFromStorage(){
	filterString="";
	chrome.storage.sync.get([FILTER_STRING_KEY],function(data){
		if(data){
			filterString=data.filterString;
		}
	});
	return filterString;
}

//Method to populate filter text area.
//@author nimesh
function populateFilterTextArea(){
	chrome.storage.sync.get([FILTER_STRING_KEY],function(data){
		if(data){
			filterString=data.filterString;
			$('#filterArea').val(filterString);
		}
	});
}
