var app = angular.module('groupDropper');
app.controller('productControl', function(product, $scope, $location, $routeParams, productService, $rootScope){
	var id = product.data._id;
	$scope.product = productService.getProduct({productId: $routeParams.productId});
	$scope.product = {};

// $scope.vote = function(option) {
	
// 	option.votes++;
// 	productService.castVote(id, option)
// 	.then(function (res) {
// 		console.log(res);
// 		$rootScope.$broadcast('updateUser')
// 		$location.path('/products/' + id + '/stats')
// 	})
// 	}
	

	$scope.singleProduct = product.data;



	$scope.getProduct = function(id) {
		productService.getProduct(id).then(function(){
		})
	};


});