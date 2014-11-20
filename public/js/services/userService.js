var app = angular.module('groupDropper');

app.service('userService', function($http, $q, $location){
	
	this.deleteUser = function(){
		return $http({
			method: 'POST',
			url: '/account/delete'
		});
	}

	this.unlinkAccount = function(provider){
		return $http({
			method: 'GET',
			url: '/account/unlink/' + provider
		});
	}

});