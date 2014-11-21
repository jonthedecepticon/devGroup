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
	
	$scope.updateProfile = function(){
		 console.log('Scope user is: ', $scope.userUpdate)
		userService.updateProfile($scope.userUpdate)
			.then(function(user){
				$location.path('/profile');
			})
			$scope.userUpdate = '';
	}
	//TODO: fix password
	$scope.passwordUpdate = function(){
		console.log('Scope user is: ', $scope.updatePassword)
		userService.passwordUpdate($scope.updatePassword)
			.then(function(User){
				console.log('password updated')
			})
			// $scope.updatePassword1 = ''; 
			// $scope.updatePassword2 = '';
	}

	$scope.signUp = function(){
		userService.signUp($scope.userSignUp)
			.success(function(User){
				$location.path('/products');
			})
			.error(function(){
				console.log('incorrect')
			})
	}

	$scope.login = function(){
		userService.login($scope.userLogin)
			.success(function(User){
				$location.path('/products');
			})
			.error(function(){
				console.log('incorrect')
			})
		
	}
	

	$scope.getCurrentUser = function() {
		userService.getCurrentUser().then(function(data) {
			$scope.currentUser = data;
			console.log('current User: ', $scope.currentUser);
		});
	};
});



