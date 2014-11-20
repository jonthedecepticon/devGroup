var app = angular.module('groupDropper');

app.controller('userControl', function($rootScope, $scope, productService, $location, userService){
	$scope.deleteUser = function() {
		userService.deleteUser()
			.then(function(user){
				$location.path('/login');
			})
	};

	$scope.unlinkAccount = function(provider){
		userService.unlinkAccount(provider)
			.then(function(user){
				$location.path('/profile');
			})
	};
	
});



