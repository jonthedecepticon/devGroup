var app = angular.module('groupDropper');

app.controller('mainControl', function($rootScope, $scope, productService, $location, userService){

	// $scope.myModel ={
	// 	Name: 'GroupDropper'
	 
	// };
	// $scope.myModel.FbLikeUrl = 'http://localhost:3000';
	// 
	console.log($scope.products)

	$scope.updateUser = function(){
		userService.getUser().then(function(data){
			$scope.user = data.data;
			if($scope.user){
				$scope.isUserLoggedIn = true;
			} else {
				$scope.isUserLoggedIn = false;
			}
			$scope.getProducts();
		})
	};

$scope.updateUser();

	$scope.products = [];

	$scope.getProducts = function(products){
		productService.getProducts().then(function(products){
			$scope.products = products;
		});
	};


	$scope.createProduct = function(){
		$location.path('/create');

	};
	
	// Updates data to display when a product is clicked
	$scope.viewProduct = function(product){

		$scope.currentProduct = product;
		// $location.path('/products/' + product._id);
		// console.log($scope.products);
	};


	$scope.$on('updateUser', function(){
		$scope.updateUser();
		console.log('It is updating')
	});

	$scope.fbLogOut = function(){
		$scope.isUserLoggedIn = false;
		$location.path('/logout')
		$scope.onHome = false;
	};


	$scope.purchase = function(){
	// $scope.currentOrders = $scope.singleProduct.currentOrders;
	// $scope.maxThreshold = $scope.singleProduct.peopleThreshold;
	// $scope.currentThreshold = $scope.singleProduct.currentThreshold;
	productService.purchase($scope.currentProduct)
	.then(function (updatedProducts){
		$scope.products = updatedProducts.products;
		$scope.currentProduct = updatedProducts.product;
		// if($scope.currentOrders === $scope.threshold){
  //     return $scope.singleProduct.startingPrice =- $scope.singleProduct.reductionAmount;
  //     $scope.currentThreshold = $scope.maxThreshold;
  //   } else {
  //     $scope.currentThreshold =- 1;
  //   }
	})
	//$scope.getProduct();
}





});




