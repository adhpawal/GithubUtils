$(document).ready(function(){
	var ISSUE_BOARD_PAGE="swimlanes.html";
	var OAUTH_KEY_VALUE="";
	var IS_GIT_LOGGED_IN=true;
	var STORED_REPO_KEY="preferredRepo";
	var PREFERRED_REPO_VALUE="74d00c0aad74ad71c67fa6ddaf70bf0e8f630e63";
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
			OAUTH_KEY_VALUE=response.oauthValue;
			console.log("oauth value: "+OAUTH_KEY_VALUE);
			if(OAUTH_KEY_VALUE!="" || OAUTH_KEY_VALUE!=null){
				IS_GIT_LOGGED_IN=true;
				console.log("logged : "+IS_GIT_LOGGED_IN);
			}
			console.log("outside"+IS_GIT_LOGGED_IN);
			getRepoKey();
		});

	}

	function getRepoKey(){
		chrome.runtime.sendMessage({action:STORED_REPO_KEY},function(response){
			PREFERRED_REPO_VALUE=response.preferredRepo;
			console.log("repo value"+PREFERRED_REPO_VALUE);
			console.log('preferred repo: '+PREFERRED_REPO_VALUE);
			getGithubRequiredVariables();
		});
	}
	/**
	* Method to get all required git variables like milestone,repository
	* @author nimesh
	**/
	function getGithubRequiredVariables(){
		if(IS_GIT_LOGGED_IN){
			getAllGitRepository();
			// getGitMilestone();
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
			url:labelApiUrl,
			type:"GET",
			beforeSend:function(xhr){xhr.setRequestHeader("Authorization: token",OAUTH_KEY_VALUE)},
			success:function(data){
				var mileStoneList=JSON.parse(data);
				console.log(mileStoneList);
			}
		});
	}

	/**
	* Method to get specific Issue for that repo.
	* @param repoObject A javascript object containing attributes owner(owner organization) and name(name of the repo).
	* @param issueNumber number of issue
	* @author sanjaya
	**/
	function getSpecificIssues(repoObject, issueNumber){
		var issueApiUrl="https://api.github.com/repos/"+repoObject.owner+"/"+repoObject.name+"/issues/"+issueNumber;
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
	function editSpecificIssues(repoObject, issueNumber, updateData){
		var issueApiUrl="https://api.github.com/repos/"+repoObject.owner+"/"+repoObject.name+"/issues/"+issueNumber;
		$.ajax({
			url:issueApiUrl,
			type:"PATCH",
			beforeSend:function(xhr){xhr.setRequestHeader("Authorization: token",OAUTH_KEY_VALUE)},
			data: updateData,
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
