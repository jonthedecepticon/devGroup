var app = angular.module('groupDropper');
app.controller('productControl', function(product, $scope, $location, $routeParams, productService, $rootScope){
	
	$scope.getProducts = function(products){
		productService.getProducts().then(function(products){
			$scope.products = products;
		});
	};

	// gets a products from productService
	$scope.getProduct = function(id) {
		productService.getProduct(id).then(function(){
	});
}


$scope.purchase = function(){
	productService.purchase($scope.currentProduct)
	.then(function (savedProduct){
		$scope.currentProduct = savedProduct;
	})
}


// GroupDropper steps on purchase button action:
// 1. redirect to checkout page
// 2. calculate totals
// 3. run card information
// 4. issue rebate of difference at listing end.
// 5. reidrect to product page upon payment confirmation.


$scope.getProducts();
});




