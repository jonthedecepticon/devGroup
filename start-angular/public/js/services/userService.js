var app = angular.module('groupDropper');

app.service('userService', function($http, $q, $location){

	this.getUser = function(){
		 	return $http ({
		 		method: 'GET',
		 		url: '/me'
		 	});
		}
});