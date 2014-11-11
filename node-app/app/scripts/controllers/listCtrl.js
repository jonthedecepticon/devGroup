'use strict';
// ? this code repeats 3 times... why ?
angular.module('100App')
  .controller('listCtrl', function ($scope, $rootScope, $firebase, $modal, listService, $filter, $stateParams, onFinishRenderDirective) {

/* - - - - - - - - - - - - - - - - - - *\
    #SCOPE VARIABLES
\* - - - - - - - - - - - - - - - - - - */
// list
var list = listService.getList();
console.log(list);
var isSelected = 0;
list.$bind($scope, 'list');
$scope.$watch('list', function(list) {
    // DIRTY HACK:
    if ($scope.selectedPerson) {
        $scope.selectedPerson = list[$scope.selectedPerson.id]
    }
}, true)
// database
var dbRef = new Firebase('https://top100.firebaseio.com');
// location
$scope.locationName = listService.getLocationName();
//param
$scope.param = $stateParams;
// login prompt
$scope.loginPrompt = function(){
    listService.loginPrompt();
}
// setting filter with an object
$scope.setFilter = function(value){
    console.log(value);
    $scope.sortField = value;
}





/* - - - - - - - - - - - - - - - - - - *\
    #COMMENTS
\* - - - - - - - - - - - - - - - - - - */
$scope.commentCreate = function (threadFromView, selectedPerson, userID){
    if (userID) {
        var personRef = dbRef.child('/'+locationName+'/'+selectedPerson.id+'/comments/');
        personRef.push({'user': userID,'comment': threadFromView,'value':1});
        comment.count++;
        $( '#commentCreateForm' ).each(function(){
        this.reset();
        });
        //rewards user for engagment 
    } else {
        listService.loginPrompt();
    }
}
$scope.upVoteComment = function (comment, selectedPerson, userID) {
    console.log('You clicked for up vote comment');
    if (userID){
        if(comment[userID]){
            // tell them they can't vote
            if ( comment[userID].type === 1){
                alert('you already voted on this');
            } else {
                comment[userID].type=1;
                comment.value++;
            }
        } else {
            //create the userId for this tagName
            selectedPerson.lastVote = new Date();
            comment[userID] = {type:1};
            comment.value++;
        }
        //rewards user for engagment 
    } else {
        listService.loginPrompt();
    }
}
$scope.downVoteComment = function (comment, selectedPerson, userID) {
    console.log('You clicked for down Vote');
    if (userID){
        if(comment[userID]){
            // tell them they can't vote
            if ( comment[userID].type === -1){
                alert('you already voted on this');
            } else {
                comment[userID].type=-1;
                comment.value--;
            }
        } else {
            //create the userId for this tagName
            selectedPerson.lastVote = new Date();
            comment[userID] = {type:-1};
            comment.value--;
        }
        //rewards user for engagment 
    } else {
        listService.loginPrompt();
    }
}





/* - - - - - - - - - - - - - - - - - - *\
    #OVERALL SCORE
\* - - - - - - - - - - - - - - - - - - */
$scope.showOverall = function (person, $event) {
    $('.showOverall').hide();
    $($event.target).nextAll('.showOverall').show();
};
$scope.upVoteOverall = function (selectedPerson, userID, fromMain) {
    console.log('fromMain', fromMain);
    //sets that it was up vote from Main View
    isSelected = fromMain;
    if (userID){
        if(selectedPerson.overallVotes[userID]){
            // tell them they can't vote
            if ( selectedPerson.overallVotes[userID].type === 1){
                alert('you already voted on this');
            } else {
                selectedPerson.overallVotes[userID].type=1;
                selectedPerson.overallVotes.value++;
            }
        } else {
            //create the userId for this tagName
            selectedPerson.lastVote = new Date();
            selectedPerson.overallVotes[userID] = {type:1};
            selectedPerson.overallVotes.value++;
        }
        //rewards user for engagment 
    } else {
        listService.loginPrompt();
    }
}
$scope.downVoteOverall = function (selectedPerson, userID) {
    console.log('you already voted on this');
    if (userID){
        if(selectedPerson.overallVotes[userID]){
            // tell them they can't vote
            if ( selectedPerson.overallVotes[userID].type === -1){
                alert('you already voted on this');
            } else {
                selectedPerson.overallVotes[userID].type=-1;
                selectedPerson.overallVotes.value--;
            }
        } else {
            //create the userId for this tagName
            selectedPerson.lastVote = new Date();
            selectedPerson.overallVotes[userID] = {type:-1};
            selectedPerson.overallVotes.value = 49;
        }
        //rewards user for engagment 
    } else {
        listService.loginPrompt();
    }
}





/* - - - - - - - - - - - - - - - - - - *\
    #SET SELECTED ITEM
\* - - - - - - - - - - - - - - - - - - */
$scope.setItem = function (item, fromModal) {
    isSelected = fromModal;
	$scope.selectedItem = item;
    if(! isSelected){
        $("#modal").modal('show'); // hack (should use angular-strap or anguar-ui)
    }
};
$scope.bioCreate = function(bioFromView){
    console.log(bioFromView)
    console.log('stepped into bio Create')
}
$scope.cancel = function(){
    console.log('you clicked to cancel');
   $("#modal").modal('hide');
}






/* - - - - - - - - - - - - - - - - - - *\
    #CREATE MODAL CREATION AND DISMISS
\* - - - - - - - - - - - - - - - - - - */
$scope.callCreateModal = function (e) {
   console.log('you called Create Modal');
    $("#createModal").modal('show'); // hack (should use angular-strap or anguar-ui)
}
$scope.cancelCreateModal = function(e){
    console.log('you clicked to cancel');
   $("#createModal").modal('hide');
}





/* - - - - - - - - - - - - - - - - - - *\
    #TAGS
\* - - - - - - - - - - - - - - - - - - */
$scope.tagCreate = function (tagName, selectedPerson, userID){
    if (userID) {
        var tagName = angular.lowercase(tagName);
        if (selectedPerson.votes[tagName]){
            if ( selectedPerson.votes[tagName][userID].type === 1){
                alert('you already voted on this');
            } else {
            //create the userId for this tagName
            selectedPerson.lastVote = new Date();
            selectedPerson.votes[tagName][userID] = {type:1};
            selectedPerson.votes[tagName].value++;
            }
        } else {
            selectedPerson.votes[tagName] = {tagName:tagName,value:1};
            selectedPerson.votes[tagName][userID] = {type:1};
        }
        $( '#tagCreateForm' ).each(function(){
        this.reset();
        });
        //rewards user for engagment 
    } else {
        listService.loginPrompt();
    }
}
$scope.upVote = function (tagName, selectedPerson, userID, $filter) {
    console.log('You clicked for up vote');
    if (userID){
        if(selectedPerson.votes[tagName][userID]){
            // tell them they can't vote
            if ( selectedPerson.votes[tagName][userID].type === 1){
                alert('you already voted on this');
            } else {
                selectedPerson.votes[tagName][userID].type=1;
                selectedPerson.votes[tagName].value++;
            }
        } else {
            //create the userId for this tagName
            selectedPerson.lastVote = new Date();
            selectedPerson.votes[tagName][userID] = {type:1};
            selectedPerson.votes[tagName].value++;
        }
        //rewards user for engagment 
    } else {
        listService.loginPrompt();
    }
}
$scope.downVote = function (tagName, selectedPerson, userID, $filter) {
    console.log('You clicked for down Vote');
    if (userID){
        if(selectedPerson.votes[tagName][userID]){
            // tell them they can't vote
            if ( selectedPerson.votes[tagName][userID].type === -1){
                alert('you already voted on this');
            } else {
                selectedPerson.votes[tagName][userID].type=-1;
                selectedPerson.votes[tagName].value--;
            }
        } else {
            //create the userId for this tagName
            selectedPerson.lastVote = new Date();
            selectedPerson.votes[tagName][userID] = {type:-1};
            selectedPerson.votes[tagName].value--;
        }
        //rewards user for engagment 
    } else {
        listService.loginPrompt();
    }
}



/* - - - - - - - - - - - - - - - - - - *\
    #NG-REPEAT RENDER FINISHED
\* - - - - - - - - - - - - - - - - - - */
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        $('#list-container').mixItUp({
    animation: {
      animateChangeLayout: true, 
      animateResizeTargets: true, 
      duration: 500,
      effects: 'fade rotateZ(180deg) rotateX(180deg) scale(0.01)',
      easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)'
    },
    layout: {
      containerClass: 'list' //inital layout
    }
  });// HACK - removes empty block on links
       $('.item-modal .additional-links li:first-child').remove();  
    });


});




  
