var app = angular.module('groupDropper');

app.service('userService', function($http, $q, $location){
	
	this.deleteUser = function(){
		return $http({
			method: 'DELETE',
			url: '/account/delete' + user._id
		});
	}
});