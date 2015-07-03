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
		console.log("get git vari");
		if(IS_GIT_LOGGED_IN){
			getAllGitRepository();
			// getGitMilestone();
		}
	}

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
});