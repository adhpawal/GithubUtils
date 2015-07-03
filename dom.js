
const FILTER_STRING_KEY="filterString";

$(document).ready(function(){
	console.log("dom ready");
	var FILTER_STRING_KEY="filterString";

	// /**
	// * Query current tab on page load to find out which page is loaded, filter page or issue board page.
	// * Perform the actions according to the result
	// * @author nimesh
	// **/
	// chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
	// 	var tabUrl=tabs[0].url;
	// 	if(tabUrl.indexOf(ISSUE_BOARD_PAGE)>-1){
	// 		console.log("okay");
	// 		actionForIssueBoardPage();
	// 	}
	// 	else{
			
	// 	}
	// });

	applyFilter();

	/**
	* Function to apply filter for pull request.
	*@author nimesh
	**/
	function applyFilter(){

		/**Load the filter pages stored in browser. After retrieving, apply filter.
		** @author nimesh
		**/
		chrome.storage.sync.get(FILTER_STRING_KEY,function(data){
			console.log("data from storage: "+data.toString());
			if(data){
				filterString=data.filterString;
				console.log(filterString);
				hideFilterPages(filterString);
			}
			else{
				console.log("no data for filter");
			}
		});
	}
	

	/**
	* Method to hide pages described in filter list.
	* @param filterString The string containing list of filter pages separated by comma.	
	* @author nimesh
	**/
	function hideFilterPages(filterString){
		console.log("hiding filter pages. : "+filterString);
		if(filterString){
			var filterPages=filterString.split(",");
			for(var i=0; i<filterPages.length;i++){
				$('div[data-path*="'+filterPages[i].trim()+'"]').each(function (){
					$(this).parent().hide();
				});
			}
		}
	} 

	/**
	* Add listener for message passed to dom.js
	* @author nimesh
	**/  
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

	});


});