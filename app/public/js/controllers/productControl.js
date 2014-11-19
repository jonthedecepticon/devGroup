var app = angular.module('groupDropper');
app.controller('productControl', function(product, $scope, $location, $routeParams, productService, $rootScope){
	// var id = product.data._id;
	// $scope.product = productService.getProduct({productId: $routeParams.productId});
	// $scope.product = {};
	
	$scope.getProducts = function(products){
		productService.getProducts().then(function(products){
			$scope.products = products;
		});
	};

	

	// $scope.singleProduct = product.data;

	// gets a products from productService
	$scope.getProduct = function(id) {
	
		productService.getProduct(id).then(function(){

		})
	
	};





$scope.purchase = function(){
	// $scope.currentOrders = $scope.singleProduct.currentOrders;
	// $scope.maxThreshold = $scope.singleProduct.peopleThreshold;
	// $scope.currentThreshold = $scope.singleProduct.currentThreshold;
	productService.purchase($scope.currentProduct)
	.then(function (savedProduct){
		$scope.currentProduct = savedProduct;
		// if($scope.currentOrders === $scope.threshold){
  //     return $scope.singleProduct.startingPrice =- $scope.singleProduct.reductionAmount;
  //     $scope.currentThreshold = $scope.maxThreshold;
  //   } else {
  //     $scope.currentThreshold =- 1;
  //   }
	})
	//$scope.getProduct();
}

// GroupDropper listing mechanics
// After purchase confirmation:
// 1.check to see if threshold is met. If threshold is met drop current price by reductionAmount
// 	and reset 'next drop' to maximum; If threshold not met, reduce 'next drop' by quantity purchased.

// GroupDropper steps on purchase button action:
// 1. redirect to checkout page
// 2. calculate totals
// 3. run card information
// 4. issue rebate of difference at listing end.
// 5. reidrect to product page upon payment confirmation.


$scope.getProducts();
});




