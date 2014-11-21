var app = angular.module('groupDropper');

app.controller('checkoutControl', function($scope, product, productService){
	$scope.getProduct = function(id) {
		productService.getProduct(id).then(function(){
		})
	};

	$scope.getProduct();

	$scope.currentProduct = product.data;


})