var app = angular.module('groupDropper');

app.service('userService', function($http, $q, $location){
	this.getCurrentUser = function() {
		return $http({
			method: 'GET',
			url: '/account'
		});
	}


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
	//TODO: fix update so string doesnt delete previous info. 
	this.updateProfile = function(user){
		return $http({
			method: 'POST',
			url: '/account/profile',
			data: {
				email: user.email,
				name: user.name,
				location: user.location,
				website: user.website
			}
		});
	}
	//TODO: fix password
	this.passwordUpdate = function(user){
		return $http({
			method: 'POST',
			url: '/account/password',
			data: {
				password: user.password
			}
		});
	}
	
	this.signUp = function(user){
		return $http({
			method: 'POST',
			url: '/signup',
			data: {
				email: user.email,
				password: user.password
			}
		});
	}

	this.login = function(user){
		return $http({
			method: 'POST',
			url: '/login',
			data: {
				email: user.email,
				password: user.password
			}
		});
	}


});