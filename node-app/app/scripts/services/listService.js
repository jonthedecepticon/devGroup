'use strict';

angular.module('100App').factory('listService', function listService($q, $firebase){
var deferred = $q.defer();
var FBURL = "https://top100.firebaseio.com/";

return {
    getList: function () {
        var ref = new Firebase(FBURL + 'uvef');
        return $firebase(ref);

    },
    getUsers: function () {
        var ref = new Firebase(FBURL + 'users');
        return $firebase(ref);
    },
    getLocationName: function(){
        return 'uvef';
    },

    loginPrompt: function(){
      console.log('you clicked login');
        $('body').toggleClass('modal-open-up');
    },
};
return deferred.promise;
});





