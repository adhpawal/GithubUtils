var FILTER_STRING_KEY = "filterString";

$(document).ready(function () {
    var GET_FILTER_STRING = "getFilterString";
    var SAVE_FILTER_DATA = "saveFilterData";
    const OKAY = "ok";
    const OPEN_ISSUE_BOARD_PAGE = "openIssueBoardPage";
    const RELOAD_PAGE = "reloadPage";
    const ISSUE_BOARD_PAGE = "swimlanes.html";
    var GET_STORED_OAUTH_VALUE = "getStoredOauthValue";
    var OAUTH_STORAGE_KEY = "oath_key";
    var GET_PREFERRED_REPO = "getPreferredRepo";
    var STORED_REPO_KEY = "preferredRepo";
    var GET_FILTER_STRING = "getFilterString";
    var SAVE_FILTER_DATA = "saveFilterData";
    var GET_STORED_OAUTH_VALUE = "getStoredOauthValue";
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

    //populate filter text area after page load.
    populateFilterTextArea();

    // var valuePair={};
    // 	 	valuePair[STORED_REPO_KEY] ="#%Repo$$Key";
    // 	 	valuePair[OAUTH_STORAGE_KEY]="/Atuth storage//key";
    // 	 	chrome.storage.sync.set(valuePair, function() {
    // 	 		if(chrome.runtime.lastError){
    // 	 		}
    // 			console.log("okay");
    //         });


    /**
     ** Add message listners for messages. Listeners listen for message from popup.js and dom.js
     ** These listeners serve as trigger to take appropriate action.
     **/
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log("request data for extension.js is : " + request);
        switch (request.action) {
            case "read_file" :
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
                valuePair[FILTER_STRING_KEY] = filterPages;
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
            case GET_STORED_OAUTH_VALUE :
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
            default :
        }
        console.log("Returned State")
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
    chrome.storage.sync.get([FILTER_STRING_KEY], function (data) {
        if (data) {
            filterString = data.filterString;
            $('#filterArea').val(filterString);
        }
    });
}