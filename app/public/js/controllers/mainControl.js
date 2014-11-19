var app = angular.module('groupDropper');

app.controller('mainControl', function($rootScope, $scope, productService, $location, userService){

	// $scope.myModel ={

	// 	Name: 'GroupDropper'
	 
	// };
	// $scope.myModel.FbLikeUrl = 'http://localhost:3000';
	// 
	console.log($scope.products)

	// $scope.updateUser = function(){
	// 	userService.getUser().then(function(data){
	// 		$scope.user = data.data;
	// 		if($scope.user){
	// 			$scope.isUserLoggedIn = true;
	// 		} else {
	// 			$scope.isUserLoggedIn = false;
	// 		}
	// 		$scope.getProducts();
	// 	})
	// };

	// 	Name: 'GroupDropper',
	// 	ImageUrl: 'https://fbcdn-profile-a.akamaihd.net/hprofile-ak-xaf1/v/t1.0-1/c44.0.160.160/p160x160/10615576_1506031749682492_331069997498428397_n.png?oh=f88bbe14da45fed367762af9008a4057&oe=54D2EE8F&__gda__=1423429513_6bf2199e86faea8dca2b0233917d3dcb'
	// };

	// $scope.updateUser = function(){
	// 	userService.getUser().then(function(data){
	// 		$scope.user = data.data;
	// 		if($scope.user){
	// 			$scope.isUserLoggedIn = true;
	// 		} else {
	// 			$scope.isUserLoggedIn = false;
	// 		}
	// 		$scope.getProducts();
	// 	})
	// };


// $scope.updateUser();

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


	// $scope.$on('updateUser', function(){
	// 	$scope.updateUser();
	// 	console.log('It is updating')
	// });
	
	



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


$scope.getProducts();



});




