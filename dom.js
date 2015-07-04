$(document).ready(function(){
	var EXCLUDE_PAGES="excluedPages";
    var INCLUDE_ONLY_PAGES="includeOnlyPages";
    var FILTER_OPTION="filterOption";
	applyFilter();

	/**
	* Function to apply filter for pull request.
	*@author nimesh
	**/
	function applyFilter(){

		/**Load the filter pages stored in browser. After retrieving, apply filter.
		** @author nimesh
		**/
		chrome.storage.sync.get([EXCLUDE_PAGES,INCLUDE_ONLY_PAGES,FILTER_OPTION],function(data){
			if(data){
				var filterString;
				var filterOption=data[FILTER_OPTION];
				if(filterOption==1){
					//apply exclude files filter.
					filterString=data[EXCLUDE_PAGES];
				}
				else if(filterOption==0){
					filterString=data[INCLUDE_ONLY_PAGES];
				}
				hideFilterPages(filterString,filterOption);
			}
			else{
			}
		});
	}
	

	/**
	* Method to hide pages described in filter list.
	* @param filterString The string containing list of filter pages separated by comma.	
	* @author nimesh
	**/
	function hideFilterPages(filterString,filterOption){
		if(filterString){
			var filterPages=filterString.split(",");
			for(var i=0; i<filterPages.length;i++){
				$('div[data-path$="'+filterPages[i].trim()+'"]').each(function (){
					if(filterOption==1){
						$(this).parent().hide();
					}
					else if(filterOption==0){
						$(this).attr("data-show","show");
					}
					
				});
			}
			if(filterOption==0){
				$("div[data-path]:not([data-show])").parent().hide();
			}
		}
	} 

});