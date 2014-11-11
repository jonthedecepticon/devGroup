'use strict';

angular.module('100App')
  .controller('tagCtrl', function ($scope, listService) {

///////////////////////////
// Make Clicks on Tags Dynamic
///////////////////////////
    // upVote on tag
    $scope.upVote = function (selectedPerson, tagName) {
      console.log('selectedPerson', selectedPerson)
      selectedPerson.tags[tagName]++;
    };
    // downVote on tag
    $scope.downVote = function (selectedPerson, tagName) {
      selectedPerson.tags[tagName]--;
    };
    //tried doing it like this in refactored modal.html repeat
      // $scope.upVote = function (selectedPerson, tagName) {
      // selectedPerson.tags[tagName.v]++;
      // };
});
