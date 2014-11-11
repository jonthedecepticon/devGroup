'use strict';

angular.module('100App')
  .controller('ItemCtrl', function ($scope, $rootScope, listService) {
    /* - - - - - - - - - - - - - - - - - *\

      creates new item via createModal

    \*- - - - - - - - - - - - - - - - - -*/
    $scope.createItem = function(itemNameFromView, itemTagLineFromView, itemWebsiteFromView, itemImageFromView, contactNameFromView, contactEmailFromView, contactPhoneFromView){
      
     var guid = (function() {
       function s4() {
         return Math.floor((1 + Math.random()) * 0x10000)
         .toString(16)
         .substring(1);
       }
       return function() {
         return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
       };
     })();
     var uuid = guid();

     var dataBase = new Firebase ("https://top100.firebaseio.com/uvef/" + uuid);
      dataBase.set({
         "name": itemNameFromView,
         "image" : itemImageFromView,
         "tagline": itemTagLineFromView,
         "contactEmail" : contactEmailFromView,
         "contactName" : contactNameFromView,
         "contactPhone" : contactPhoneFromView,
         "link" : itemWebsiteFromView,
         "dateCreated": new Date(),
         "overallVotes": {
            'value':50
         }, 
         "comments": {
            'count':0
        }
      });
    }
});


