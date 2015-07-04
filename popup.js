(function () {
    "use strict";
    $(document).ready(function () {
        var SAVE_FILTER_DATA = "saveFilterData";
        var OKAY = "ok";
        var OPEN_ISSUE_BOARD_PAGE = "openIssueBoardPage";
        var EXCLUDE_PAGES="excluedPages";
        var INCLUDE_ONLY_PAGES="includeOnlyPages";
        //add filter-button click listener.
        //Store the filter values in chrome storage via message to
        $('#filter-button').on("click",function () {
        	var saveTo;
        	var filterPages;
        	var filterOption=$('input[name="filter-radio"]:checked').val();
        	if(filterOption==1){
        		saveTo=EXCLUDE_PAGES;
        		filterPages = $('#filterArea1').val();
        	}
        	else if(filterOption==0){
        		saveTo=INCLUDE_ONLY_PAGES;
        		filterPages=$('#filterArea2').val();
        	}
            chrome.runtime.sendMessage({action: SAVE_FILTER_DATA, data: filterPages,key:saveTo,filterOption:filterOption}, function (response) {
                if (response && response.status == OKAY) {
                    $('#message-text').text("Entry saved successfully.").css("color", "green").show();
                }
                else {
                    $('#message-text').text("Entry save failed.").css("color", "red").show();
                }
            });
        });

        //Issue board button click event
        $('#board-button').on("click",function () {
            chrome.runtime.sendMessage({action: OPEN_ISSUE_BOARD_PAGE}, function () {
            })
        });

        // Enable disable text area while choosing inclusive or exclusive option
        document.getElementById("exclusive").onchange = enable1;
        document.getElementById("inclusive").onchange = enable2;

        /**
         * Toggle Between Filter State.
         *
         * @author aakas
         */
        function enable1() {
            document.getElementById("filterArea1").disabled = false;
            document.getElementById("filterArea2").disabled = true;
        }

        /**
         * Toggle Between Filter State.
         *
         * @author aakas
         */
        function enable2() {
            document.getElementById("filterArea2").disabled = false;
            document.getElementById("filterArea1").disabled = true;
        }
    });

})();
