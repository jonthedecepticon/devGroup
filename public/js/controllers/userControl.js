var app = angular.module('groupDropper');

app.controller('userControl', function($rootScope, $scope, productService, $location, userService){
	$scope.deleteUser = function() {
		userService.deleteUser($scope.user.id);
	};

	$scope.currentUser = function() {
		userService.getCurrentUser().then(function(data) {
			$scope.user = data;
			console.log($scope.user);
		})
	}();
});

// from server.js/**
//  * Load controllers.
//  */
// var Product = require('./server-assets/product/productModel');
// var routes = require('./server-assets/database');
// var User = require('./server-assets/user/userModel');
// var homeController = require('./server-assets/home/homeControl');
// var apiController = require('./server-assets/api/apiControl');
// // var itemController = require('./server-assets/product/itemControl');
// var contactController = require('./server-assets/contact/contactControl');
// var userController = require('./server-assets/user/userControl');

