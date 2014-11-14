var app = angular.module('groupDropper');

app.controller('mainControl', function($rootScope, $scope, productService, $location, userService){




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

	// $scope.updateUser();

	$scope.products = [];

	$scope.product = {
		productTitle: '',
		startingPrice: '',
		minimumPrice: '',
		reductionAmount: '',
		peopleThreshold: '',
		productPic: ''
	};

	// $scope.addOption = function(){
	// 	$scope.product.productOptions.push({text: ''})
	// };

	// $scope.removeOption = function(){

	// 	$scope.product.productOptions.splice($scope.product.productOptions.indexOf(), 1);
	// }

	$scope.getProducts = function(products){
		
		$scope.limit = 0;
		productService.getProducts().then(function(products){
			$scope.products = products;
			// for(var i = 0; i < $scope.products.length; i++){
			// 		if($scope.user && $scope.products[i].allVotes >= 5){
			// 			$scope.trendingProducts.push(products[i]);
			// 			$scope.trendingProducts[i].productTaken = false;
			// 		} else if($scope.user && $scope.products[i].allVotes >= 5 && $scope.user.votedProducts.indexOf($scope.products[i]._id) > -1){
			// 			$scope.trendingProducts.push(products[i]);
			// 			$scope.products.splice(i, 1);
			// 			$scope.limit++;
			// 			$scope.trendingProducts[i].productTaken = true;
			// 	} else if($scope.user && $scope.user.votedProducts.indexOf($scope.products[i]._id) > -1){
			// 		$scope.products[i].productTaken = true;
			// 	} else {
			// 		$scope.products[i].productTaken = false;
			// 		$scope.trendingProducts[i].productTaken = false;
			// 	}
			// }
		});
	};

	$scope.onHome = true;
	$scope.getProducts();

	$scope.createProduct = function(){
		$scope.onHome = false;
		$location.path('/create');

	};
	
	// Updates data to display when a product is clicked
	$scope.viewProduct = function(product){
		$location.path('/products/' + product._id);	
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





});




