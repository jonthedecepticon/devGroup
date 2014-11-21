var app = angular.module('groupDropper');

app.controller('mainControl', function($rootScope, $scope, productService, $location, userService){


	
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
	};


	// $scope.$on('updateUser', function(){
	// 	$scope.updateUser();
	// 	console.log('It is updating')
	// });
	
	// $scope.logout = function(req, res) {
	//   req.logout();
	//   res.redirect('/');
	// };
		
$scope.getProduct = function(id) {
		productService.getProduct(id).then(function(){
		})
	};

	$scope.purchase = function(){
	productService.purchase($scope.currentProduct)
	.then(function (updatedProducts){
		$scope.products = updatedProducts.products;
		$scope.currentProduct = updatedProducts.product;
		var id = updatedProducts.product._id;
			$location.path('/products/' + id + '/checkout')
			$scope.getProduct();	
	})
}

$scope.getProducts();

});




