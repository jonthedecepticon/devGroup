'use strict';

angular.module('100App')
  .controller('LoginCtrl', function ($scope, $rootScope, listService) {




    /* - - - - - - - - - - - - - - - - - *\

      logs in user / creates new

    \*- - - - - - - - - - - - - - - - - -*/
    $scope.submitLogin = function(fromMain){
      var dbRef = new Firebase('https://top100.firebaseio.com');
      var auth = new FirebaseSimpleLogin(dbRef, function(error, user) {
        if (error) {
          // an error occurred while attempting login
          console.log(error);
        } else if (user) {
          //hides login
          $( "#top_nav_right" ).find('a').hide()
          //checks to see if there is user
          var peopleObject = listService.getUsers();
          peopleObject.$on('loaded', function() {
            console.log('loaded:', peopleObject)
             // for loop to assign picture
            if (user.id in peopleObject) {
              $rootScope.userPicture = 'https://graph.facebook.com/' + user.id + '/picture?width=150&height=150';
              $rootScope.userID = user.id;
              $rootScope.$apply();
            } else {
                var dataBase = new Firebase ("https://top100.firebaseio.com/users/" + user.id);
                console.log('you did not have a profile, so we will make one for:');
                console.log(user);
                dataBase.set({
                 "picture" :    'https://graph.facebook.com/' + user.id + '/picture?width=150&height=150',
                 "role":        'user',
                 "email":       user.email,
                 "location":    user.location.name,
                 "firstName" :  user.first_name,
                 "lastName" :   user.last_name,
                 "fullName" :   user.displayName,
                 "gender" :     user.gender,
                 "link" :       user.link,
                 "accessToken": user.accessToken,
                 "id" :         user.id,
                 "dateCreated": Date.now(),
                 "lastLogin":   Date.now(),
                 "overallVotes": {
                                'value':50
                 },
                });
              }
          });
        }
      });
      auth.login('facebook', {
        rememberMe: true,
        scope: 'email,user_location,user_birthday'
      });
      listService.loginPrompt();
      //fixes single modal toggle
      if (fromMain){
        listService.loginPrompt();
      }
    };
});
