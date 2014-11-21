var app = angular.module('groupDropper');

app.service('userService', function($http, $q, $location){
	
	this.deleteUser = function(){
		return $http({
			method: 'POST',
			url: '/account/delete' 
		});
	}
});