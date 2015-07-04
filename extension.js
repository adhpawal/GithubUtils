
$(document).ready(function () {
    var GET_FILTER_STRING = "getFilterString";
    var SAVE_FILTER_DATA = "saveFilterData";
    const OKAY = "ok";
    const OPEN_ISSUE_BOARD_PAGE = "openIssueBoardPage";
    const RELOAD_PAGE = "reloadPage";
    const ISSUE_BOARD_PAGE = "swimlanes.html";
    var GET_STORED_VALUES_FOR_BOARD="getBoardParameters";
    var OAUTH_STORAGE_KEY = "oath_key";
    var GET_PREFERRED_REPO = "getPreferredRepo";
    var STORED_REPO_KEY = "preferredRepo";
    var GET_FILTER_STRING = "getFilterString";
    var SAVE_FILTER_DATA = "saveFilterData";
    var OAUTH_STORAGE_KEY = "oath_key";
    var GET_PREFERRED_REPO = "getPreferredRepo";
    var STORED_REPO_KEY = "preferredRepo";
    var STORED_MILESTONE_KEY = "preferredMileStone";
    var STORED_MILESTONE_VALUE = "";
    var LABEL_1_KEY = "label_1";
    var LABEL_2_KEY = "label_2";
    var LABEL_3_KEY = "label_3";
    var LABEL_4_KEY = "label_4";
    var LABEL_1_VALUE = "";
    var LABEL_2_VALUE = "";
    var LABEL_3_VALUE = "";
    var LABEL_4_VALUE = "";
    var SAVE_PARAMETER_ACTION="saveParameters";
    var EXCLUDE_PAGES="excluedPages";
    var INCLUDE_ONLY_PAGES="includeOnlyPages";
    var FILTER_OPTION="filterOption";
    var READ_FILE="read_file";

    //populate filter text area after page load.
    populateFilterTextArea();


    /**
     ** Add message listners for messages. Listeners listen for message from popup.js and dom.js
     ** These listeners serve as trigger to take appropriate action.
     **/
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        switch (request.action) {
            case READ_FILE :
                $.ajax({
                    url: chrome.extension.getURL(ISSUE_BOARD_PAGE),
                    dataType: "html",
                    success: function (html) {
                        sendResponse({page: html});
                    }
                });
                break;
            case GET_FILTER_STRING :
                chrome.storage.sync.get([FILTER_STRING_KEY], function (data) {
                    if (data) {
                        filterString = data.filterString;
                        sendResponse({filterString: filterString});
                    }
                });
                break;
            case SAVE_FILTER_DATA :
                filterPages = request.data
                var valuePair = {};
                valuePair[request.key] = filterPages;
                valuePair[FILTER_OPTION]=request.filterOption;
                chrome.storage.sync.set(valuePair, function () {
                    if (chrome.runtime.lastError) {
                        sendResponse({status: chrome.runtime.lastError.message});
                    }
                    sendResponse({status: OKAY});
                });
                break;
            case OPEN_ISSUE_BOARD_PAGE :
                var boardPageUrl = chrome.extension.getURL(ISSUE_BOARD_PAGE);
                chrome.tabs.create({url: boardPageUrl});
                break;
            case GET_STORED_VALUES_FOR_BOARD :
                var oauthValue = "";
                chrome.storage.sync.get([OAUTH_STORAGE_KEY, STORED_REPO_KEY, STORED_MILESTONE_KEY, LABEL_1_KEY, LABEL_2_KEY, LABEL_3_KEY, LABEL_4_KEY], function (data) {
                    if (data) {
                        oauthValue = data;
                        sendResponse({oauthValue: oauthValue});
                    }
                });
                break;
            case GET_PREFERRED_REPO :
                chrome.storage.sync.get(STORED_REPO_KEY, function (data) {
                    if (data) {
                        sendResponse({preferredRepo: data});
                    }
                });
                break;
            case SAVE_PARAMETER_ACTION:
            	var valueToSave=request.valueObj;
            	var keyForSave=request.key;
            	var valuePair={};
            	valuePair[keyForSave]=valueToSave;
            	chrome.storage.sync.set(valuePair,function(){
            		if (chrome.runtime.lastError) {
                        sendResponse({status: chrome.runtime.lastError.message});
                    }
                    sendResponse({status: OKAY});
            	});
            	break;
            default :
        }
        return true;
    });

    /**
     * Add change listner for storage changes.
     * Triggers when key:value stored in chrome local storage changes.
     **/
    chrome.storage.onChanged.addListener(function (changes, namespace) {
        //reload current page to reflect changes in filter data
        chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
            chrome.tabs.reload(tabs[0].id);
        });
    });

    //Method to get filter string from chrome storage
	//@author nimesh
	function getFilterStringFromStorage() {
	    filterString = "";
	    chrome.storage.sync.get([FILTER_STRING_KEY], function (data) {
	        if (data) {
	            filterString = data.filterString;
	        }
	    });
	    return filterString;
	}

	//Method to populate filter text area.
	//@author nimesh
	function populateFilterTextArea() {
	    chrome.storage.sync.get([EXCLUDE_PAGES,INCLUDE_ONLY_PAGES,FILTER_OPTION],function(data) {
	        if (data) {
	        	$('#filterArea1').val(data[EXCLUDE_PAGES]);
	            $('#filterArea2').val(data[INCLUDE_ONLY_PAGES]);
	            var filterOption=data[FILTER_OPTION];
	            if(filterOption==1){
	            	$('#exclusive').prop('checked',true);
	            	$('#filterArea1').prop('disabled',false);	
	            }
	            else if(filterOption==0){
	            	$('#inclusive').prop('checked',true);
	            	$('#filterArea2').prop('disabled',false);	
	            }
	        }
	    });
	}
});
