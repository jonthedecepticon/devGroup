var app = angular.module('groupDropper');

app.controller('createControl', function($rootScope, $scope, productService, $location, userService){

var fileArr = [];
$scope.onFileSelect = function($files){
	fileArr = $files;
}

	$scope.product = {
		productTitle: '',
		startingPrice: '',
		minimumPrice: '',
		reductionAmount: '',
		peopleThreshold: '',
		productPic: ''
	};

	$scope.createProduct = function() {
		productService.addProduct($scope.product)
		$scope.product = {
			productTitle: '',
			startingPrice: '',
			minimumPrice: '',
			reductionAmount: '',
			peopleThreshold: '',
		};
		
		$location.path('/products');
	}





});




