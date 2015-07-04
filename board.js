$(document).ready(function () {
    var ISSUE_BOARD_PAGE = "swimlanes.html";
    var OAUTH_KEY_VALUE = "";
    var OAUTH_STORAGE_KEY = "oath_key";
    var IS_GIT_LOGGED_IN = false;
    var STORED_REPO_KEY = "preferredRepo";
    var PREFERRED_REPO_VALUE = "";
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
    var MILESTONE = [];
    var MILESTONE_ISSUE=[];
    var REPOSITORY = [];
    var ISSUE = [];
    var LABEL = [];
    var GET_ALL_REPO_URL = "https://api.github.com/user/repos";
    var GET_STORED_VALUES_FOR_BOARD = "getBoardParameters";
    var GET_PREFERRED_REPO = "getPreferredRepo";
    var OKAY = "ok";
    var SAVE_PARAMETER_ACTION = "saveParameters";
    var LEVEL1_ISSUE=[];
    var LEVEL2_ISSUE=[];
    var LEVEL3_ISSUE=[];
    var LEVEL4_ISSUE=[];

    actionForIssueBoardPage();
    /**
     * Function to perform actions for issue board page.
     * Actions include check git oauth key,value in local storage.
     * Perform other actions on basis of this value.
     * @author nimesh
     **/
    function actionForIssueBoardPage() {
        chrome.runtime.sendMessage({action: GET_STORED_VALUES_FOR_BOARD}, function (response) {
            resonseValue = response.oauthValue;
            if (resonseValue != "" || resonseValue != null) {
                OAUTH_KEY_VALUE = resonseValue[OAUTH_STORAGE_KEY];
                if (OAUTH_KEY_VALUE != "" || !OAUTH_KEY_VALUE) {
                    IS_GIT_LOGGED_IN = true;
                }
                PREFERRED_REPO_VALUE = resonseValue[STORED_REPO_KEY];
                STORED_MILESTONE_VALUE = resonseValue[STORED_MILESTONE_KEY];
                LABEL_1_VALUE = resonseValue[LABEL_1_KEY];
                LABEL_2_VALUE = resonseValue[LABEL_2_KEY];
                LABEL_3_VALUE = resonseValue[LABEL_3_KEY];
                LABEL_4_VALUE = resonseValue[LABEL_4_KEY];
            }
            console.log(OAUTH_KEY_VALUE, PREFERRED_REPO_VALUE, STORED_MILESTONE_VALUE, LABEL_1_VALUE, LABEL_2_VALUE, LABEL_3_VALUE, LABEL_4_VALUE, IS_GIT_LOGGED_IN);
            if (OAUTH_KEY_VALUE != "" || !OAUTH_KEY_VALUE) {
                $("#accessed-content").show();
                //call actions for issue page
                getGithubRequiredVariables();
            } else {
                $("#page-wrapper-access-token").show();
                $("#accessed-content").hide();

            }
        });
    }

    /**
     * Method to get all required git variables like milestone,repository
     * @author nimesh
     **/
    function getGithubRequiredVariables() {
        if (IS_GIT_LOGGED_IN) {
            getAllGitRepository(true);
        }
    }

    /**
     * Method to get list of all repository
     * @author nimesh
     **/
    function getAllGitRepository(isOldValueSet) {
        $.ajax({
            url: GET_ALL_REPO_URL,
            type: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "token " + OAUTH_KEY_VALUE)
            },
            success: function (data) {
                var s = $("#repoId");
                $.each(data, function (index) {
                    REPOSITORY[this.id] = this;
                    $('<option>').val(this.id).text(this.name).attr("data-owner", this.owner).attr("data-repoobject", this).appendTo('#repoId');
                });
                if (isOldValueSet && PREFERRED_REPO_VALUE) {
                    $('#repoId').val(PREFERRED_REPO_VALUE);
                    var repoObject = REPOSITORY[PREFERRED_REPO_VALUE];
                    getAllMileStone(repoObject,true);
                    getAllLabel(repoObject,true);
                }
            }
        });
    }


    /**
     * Method to get list of all Milestone
     * @param repoObject A javascript object containing attributes owner(owner organization) and name(name of the repo).
     * @author nimesh
     **/
    function getAllMileStone(repoObject, isOldValueSet) {
        var mileStoneApiUrl = "https://api.github.com/repos/" + repoObject.full_name + "/milestones";
        $.ajax({
            url: mileStoneApiUrl,
            type: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "token " + OAUTH_KEY_VALUE)
            },
            success: function (data) {
                $.each(data, function (index) {
                    MILESTONE[this.id] = this;
                    $('<option>').val(this.id).text(this.title).attr("data-milestoneobject", this).appendTo('#mileStone');
                });
                if(isOldValueSet && STORED_MILESTONE_VALUE)
                    $('#mileStone').val(STORED_MILESTONE_VALUE);

                if(isOldValueSet){
                    getIssueBasedOnMileStone(STORED_MILESTONE_VALUE,repoObject);
                }
            }
        });
    }

    /**
     * Method to get all labes for a repo.
     * @param repoObject A javascript object containing attributes owner(owner organization) and name(name of the repo).
     * @author nimesh
     **/
    function getAllLabel(repoObject,isOldValueSet) {
        var labelApiUrl = "https://api.github.com/repos/" + repoObject.full_name + "/labels";
        $.ajax({
            url: labelApiUrl,
            type: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "token " + OAUTH_KEY_VALUE)
            },
            success: function (data) {
                $.each(data, function (index) {
                    LABEL[index] = this;
                    $('<option>').val(this.name).text(this.name).attr("data-label", this).appendTo('#lane1');
                    $('<option>').val(this.name).text(this.name).attr("data-label", this).appendTo('#lane2');
                    $('<option>').val(this.name).text(this.name).attr("data-label", this).appendTo('#lane3');
                    $('<option>').val(this.name).text(this.name).attr("data-label", this).appendTo('#lane4');
                });
                if(isOldValueSet) {
                    if (LABEL_1_VALUE)
                        $('#lane1').val(LABEL_1_VALUE);
                    if (LABEL_2_VALUE)
                        $('#lane2').val(LABEL_2_VALUE);
                    if (LABEL_3_VALUE)
                        $('#lane3').val(LABEL_3_VALUE);
                    if (LABEL_4_VALUE)
                        $('#lane4').val(LABEL_4_VALUE);
                }
            }
        });
    }

    /**
     * Method to get specific Issue for that repo.
     * @param repoObject A javascript object containing attributes owner(owner organization) and name(name of the repo).
     * @param issueNumber number of issue
     * @author sanjaya
     **/
    function getSpecificIssues(repoObject, issueNumber) {
        var issueApiUrl = "https://api.github.com/repos/" + repoObject.owner + "/" + repoObject.name + "/issues/" + issueNumber;
        $.ajax({
            url: issueApiUrl,
            type: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "token " + OAUTH_KEY_VALUE)
            },
            success: function (data) {
            }
        });
    }

    /**
     * Method to edit specific Issue for that repo.
     * @param repoObject A javascript object containing attributes owner(owner organization) and name(name of the repo).
     * @param issueNumber number of issue to edit
     * @param updateData eg: {
					  "title": "Found a bug",
					  "body": "I'm having a problem with this.",
					  "assignee": "octocat",
					  "milestone": 1,
					  "state": "open",
					  "labels": [
							"Label1",
							"Label2"
					  ]
					}
     * @author sanjaya
     **/
    function editSpecificIssues(repoObject, issueNumber, newLabel) {
        var issueApiUrl = "https://api.github.com/repos/" + repoObject.owner + "/" + repoObject.name + "/issues/" + issueNumber;
        jsonObj = '{"labels": ["'+newLabel+'"]}';
        $.ajax({
            url: issueApiUrl,
            type: "PATCH",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "token " + OAUTH_KEY_VALUE)
            },
            data: jsonObj,
            success: function (data) {
            }
        });
    }

    /**
     * Method to save issue board page preferred parameters like repository,milestone,labels.
     * @author nimesh
     * @param value The value to be saved in local storage.
     * @param key The key in which value is to be saved.
     **/
    function saveIssueBoardPageParameters(key, valueToSave) {
        chrome.runtime.sendMessage({
            action: SAVE_PARAMETER_ACTION,
            valueObj: valueToSave,
            key: key
        }, function (response) {
            if (response.status == OKAY) {
                return true
            }
        });
    }

    //Defines Draggable Element
    $(".draggable").draggable({
        revert: "invalid",
        zIndex: 10000,
        appendTo: "body",
        stack: ".draggable"
    });

    //Defines Droppable Element
    $(".droppable").droppable({
        tolerance: "intersect",
        drop: function (event, ui) {
        }
    });

    //Setting Form Interceptor
    $("#github-user-setting").on("submit", function (event) {
        $(".alert").hide();
        event.preventDefault();
        if ($("#repoId").val() != null && $("#lane1").val() != null && $("#lane2").val() != null && $("#lane3").val() != null && $("#lane4").val() != null) {
            $("#github-user-setting .alert-success").show();
            //Save token to Local Storage
            saveIssueBoardPageParameters(STORED_REPO_KEY, $("#repoId").val());
            saveIssueBoardPageParameters(STORED_MILESTONE_KEY, $("#milestone").val());
            saveIssueBoardPageParameters(LABEL_1_KEY, $("#lane1").val());
            saveIssueBoardPageParameters(LABEL_2_KEY, $("#lane2").val());
            saveIssueBoardPageParameters(LABEL_3_KEY, $("#lane3").val());
            saveIssueBoardPageParameters(LABEL_4_KEY, $("#lane4").val());
            alert($("#lane1").val());
            //Defines Draggable Element
            $(".draggable").draggable({
                revert: "invalid",
                zIndex: 10000,
                appendTo: "body",
                stack: ".draggable"
            });

            //Defines Droppable Element
            $(".droppable").droppable({
                tolerance: "intersect",
                drop: function (event, ui) {
                }
            });
            // location.reload();
        } else {
            $("#github-user-setting .alert-danger").show();
            return false;
        }

    });

    //Access Token Form Interceptor
    $("#form-access-token").on("submit", function (event) {
        event.preventDefault();
        var accessToken = $("#access-token").val();
        if (!accessToken) {
            $(".at-error").show();
            return false;
        }
        //Save Token to Local Storage
        saveIssueBoardPageParameters(OAUTH_STORAGE_KEY, accessToken);
        location.reload();
    });

    /**
     * Change event for Repo. Fetch Milestone and Label based on currently selected Repo.
     * @author adhpawal
     */
    $("#repoId").on("change", function () {
        var element = $(this).val();
        var repoObject = REPOSITORY[element];
        getAllMileStone(repoObject);
        getAllLabel(repoObject);
    });

    function getIssueBasedOnMileStone(mileStone,repoObject){
        var issueApiUrl = "https://api.github.com/repos/" + repoObject.full_name + "/issues";
        $.ajax({
            url: issueApiUrl,
            type: "GET",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "token " + OAUTH_KEY_VALUE)
            },
            success: function (data) {
                $.each(data, function (index) {
                    ISSUE[index]=this;
                    if(this.mileStone == STORED_MILESTONE_VALUE){
                        MILESTONE_ISSUE[this.id]=this;
                    }
                });
                MILESTONE_ISSUE=STORED_MILESTONE_VALUE?MILESTONE_ISSUE:ISSUE;
                divideIssueByLabel(MILESTONE_ISSUE);
            }
        });
    }

    /**
     * @author adhpawal
     */
    function divideIssueByLabel(issueList){
        $("#lane1-label").html(LABEL_1_VALUE);
        $("#lane2-label").html(LABEL_2_VALUE);
        $("#lane3-label").html(LABEL_3_VALUE);
        $("#lane4-label").html(LABEL_4_VALUE);
        $(issueList).each(function(){
            var issuePriority=1;
            $(this.labels).each(function(){
              issuePriority=getIssuePriority(issuePriority, this.name);
            });
            setIssuePriorityOrder(issuePriority,this);
        });
        appendIssueToRespectiveLane(LEVEL1_ISSUE, "lane1_swim");
        $("#lane1-count").html(LEVEL1_ISSUE.length);
        appendIssueToRespectiveLane(LEVEL2_ISSUE, "lane2_swim");
        $("#lane2-count").html(LEVEL2_ISSUE.length);
        appendIssueToRespectiveLane(LEVEL3_ISSUE, "lane3_swim");
        $("#lane3-count").html(LEVEL3_ISSUE.length);
        appendIssueToRespectiveLane(LEVEL4_ISSUE, "lane4_swim");
        $("#lane4-count").html(LEVEL4_ISSUE.length);
    }

    /**
     * @author adhpawal
     * @param currentPriority
     * @param labelName
     * @returns {number}
     */
    function getIssuePriority(currentPriority, labelName){
        var priorityNewValue=0;
        if(labelName==LABEL_4_VALUE){
            priorityNewValue = 4;
        }else if(labelName==LABEL_3_VALUE){
            priorityNewValue = 3;

        }else if(labelName==LABEL_2_VALUE){
            priorityNewValue = 2;
        }else if(labelName==LABEL_1_VALUE){
            priorityNewValue = 1;
        }
        return Math.max(currentPriority,priorityNewValue);
    }

    /**
     * @author adhpawal
     * @param currentPriority
     * @param currentIssue
     * @returns {number}
     */
    function setIssuePriorityOrder(currentPriority, currentIssue){
        if(currentPriority==4){
            LEVEL4_ISSUE.push(currentIssue);
        }else if(currentPriority==3){
            LEVEL3_ISSUE.push(currentIssue);
        }else if(currentPriority==2){
            LEVEL2_ISSUE.push(currentIssue);
        }else if(currentPriority==1){
            LEVEL1_ISSUE.push(currentIssue);
        }
    }

    /**
     * @author adhpawal
     */
    function appendIssueToRespectiveLane(issueList, lane){
        var issueFormat="";
        $(issueList).each(function(){
            issueFormat+='<div class="panel panel-default draggable"> <div class="panel-heading"> <h3 class="panel-title"><img alt="Issue Detail" src="'+this.user.avatar_url+'" width="20" height="20"/> # Issue '+this.number+'</h3> </div><div class="panel-body"> '+this.title+' </div></div>';
        });
        $("#"+lane).html(issueFormat);
        $(".draggable").draggable({
            revert: "invalid",
            zIndex: 10000,
            appendTo: "body",
            stack: ".draggable"
        });
    }

    $( "#toggle" ).click(function() {
        $( "#page-wrapper-access-token" ).slideToggle( "slow" );
    });
});
