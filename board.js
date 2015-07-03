$(document).ready(function(){
	var ISSUE_BOARD_PAGE="swimlanes.html";
	var OAUTH_KEY_VALUE="";
	var OAUTH_STORAGE_KEY="oath_key";
	var IS_GIT_LOGGED_IN=false;
	var STORED_REPO_KEY="preferredRepo";
	var PREFERRED_REPO_VALUE="";
	var STORED_MILESTONE_KEY="preferredMileStone";
	var STORED_MILESTONE_VALUE="";
	var LABEL_1_KEY="label_1";
	var LABEL_2_KEY="label_2";
	var LABEL_3_KEY="label_3";
	var LABEL_4_KEY="label_4";
	var LABEL_1_VALUE="";
	var LABEL_2_VALUE="";
	var LABEL_3_VALUE="";
	var LABEL_4_VALUE="";
	var MILESTONE=[];
	var REPOSITORY=[];
	var GET_ALL_REPO_URL="https://api.github.com/user/repos";
	var GET_STORED_OAUTH_VALUE="getStoredOauthValue";
	var GET_PREFERRED_REPO="getPreferredRepo";

	//call actions for issue page
	actionForIssueBoardPage();

	/**
	* Function to perform actions for issue board page.
	* Actions include check git oauth key,value in local storage.
	* Perform other actions on basis of this value.
	* @author nimesh
	**/
	function actionForIssueBoardPage(){

		chrome.runtime.sendMessage({action:GET_STORED_OAUTH_VALUE},function(response){
			resonseValue=response.oauthValue;
			console.log("oauth value: "+JSON.stringify(resonseValue));
			console.log(resonseValue[OAUTH_STORAGE_KEY],resonseValue[STORED_REPO_KEY]);
			if(resonseValue!="" || resonseValue!=null){
				OAUTH_KEY_VALUE=resonseValue[OAUTH_STORAGE_KEY];
				if(OAUTH_KEY_VALUE!="" || OAUTH_KEY_VALUE!=null){
					IS_GIT_LOGGED_IN=true;
				}
				PREFERRED_REPO_VALUE=resonseValue[STORED_REPO_KEY];
				STORED_MILESTONE_VALUE=resonseValue[STORED_MILESTONE_KEY];
				LABEL_1_VALUE=resonseValue[LABEL_1_KEY];
				LABEL_2_VALUE=resonseValue[LABEL_2_KEY];
				LABEL_3_VALUE=resonseValue[LABEL_3_KEY];
				LABEL_4_VALUE=resonseValue[LABEL_4_KEY];
			}
			console.log(OAUTH_KEY_VALUE,PREFERRED_REPO_VALUE,STORED_MILESTONE_VALUE,LABEL_1_VALUE,LABEL_2_VALUE,LABEL_3_VALUE,LABEL_4_VALUE,IS_GIT_LOGGED_IN);
		});

	}
	/**
	* Method to get all required git variables like milestone,repository
	* @author nimesh
	**/
	function getGithubRequiredVariables(){
		console.log("get git vari");
		if(IS_GIT_LOGGED_IN){
			getAllGitRepository();
			getGitMilestone();
		}
	}

	/**
	* Method to get list of all repository
	* @author nimesh
	**/
	function getAllGitRepository(){
		$.ajax({
			url:GET_ALL_REPO_URL,
			type:"GET",
			beforeSend:function(xhr){xhr.setRequestHeader("Authorization: token",OAUTH_KEY_VALUE)},
			success:function(data){
				var jsonObjectList=JSON.parse(data);
				console.log(jsonObjectList);
			}
		});
	}


	/**
	* Method to get list of all Milestone
	* @param repoObject A javascript object containing attributes owner(owner organization) and name(name of the repo).
	* @author nimesh
	**/
	function getAllMileStone(repoObject){
		var mileStoneApiUrl="https://api.github.com/repos/"+repoObject.owner+"/"+repoObject.name+"/milestones";
		$.ajax({
			url:mileStoneApiUrl,
			type:"GET",
			beforeSend:function(xhr){xhr.setRequestHeader("Authorization: token",OAUTH_KEY_VALUE)},
			success:function(data){
				var mileStoneList=JSON.parse(data);
				console.log(mileStoneList);
			}
		});
	}

	/**
	* Method to get all Issues in a repo.
	* @param repoObject A javascript object containing attributes owner(owner organization) and name(name of the repo).
	* @author nimesh
	**/
	function getAllIssues(repoObject){
		var issueApiUrl="https://api.github.com/repos/"+repoObject.owner+"/"+repoObject.name+"/issues";
		$.ajax({
			url:issueApiUrl,
			type:"GET",
			beforeSend:function(xhr){xhr.setRequestHeader("Authorization: token",OAUTH_KEY_VALUE)},
			success:function(data){
				var mileStoneList=JSON.parse(data);
				console.log(mileStoneList);
			}
		});
	}

	/**
	* Method to get all labes for a repo.
	* @param repoObject A javascript object containing attributes owner(owner organization) and name(name of the repo).
	* @author nimesh
	**/
	function getAllLabel(repoObject){
		var labelApiUrl="https://api.github.com/repos/"+repoObject.owner+"/"+repoObject.name+"/labels";
		$.ajax({
			url:issueApiUrl,
			type:"GET",
			beforeSend:function(xhr){xhr.setRequestHeader("Authorization: token",OAUTH_KEY_VALUE)},
			success:function(data){
				var mileStoneList=JSON.parse(data);
				console.log(mileStoneList);
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

	$("#github-user-setting").on("submit", function(event){
		$(".alert").hide();
		event.preventDefault();
		if(!$("#repoId").val() || !$("#milestone").val() || !$("#lane1").val() || !$("#lane2").val() || !$("#lane3").val() || !$("#lane4").val()){
			$(".alert-danger").show();
			return false;
		}
		$(".alert-success").show();
		//reload page
	});
});
