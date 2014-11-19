var app = angular.module('groupDropper', ['ngRoute', 'angularFileUpload', 'ngResource', 'ngCookies', 'angulike'])

// app.run([
// 	'$rootScope', function($rootScope) {
//           $rootScope.facebookAppId = '653358958106368';
//       }
// 	])

// app.run(function (userService, $rootScope, $location) {
// 		$rootScope.$on("$routeChangeStart", function () {
// 		var user = userService.getUser();
// 			if(user){
// 				$rootScope.user = user;
// 			} else {
// 				$location.path('/login');
// 			}	
// 	});
// });


app.config(function($routeProvider, $httpProvider){
	$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  $httpProvider.interceptors.push('myHttpInterceptor');

	//router here
	$routeProvider
	.when('/products', {
		templateUrl: 'views/products.html',
		controller: 'mainControl'
	})
	.when('/create', {
		templateUrl: 'views/create.html',
		controller: 'createControl'
	})
	.when('/profile', {
		templateUrl: 'views/profile.html'
	})
	.when('/login', {
		templateUrl: 'views/login.html',
		controller: 'mainControl'
	})
	.when('/products/:productId', {
		templateUrl: 'views/products.html', // displays product data on same page
		controller: 'productControl',
		resolve: {
			product: function(productService, $route) {
				return productService.getProduct($route.current.params.productId)
			}
		}
	})
	
	.otherwise({
		redirectTo: '/login'
	})
 
});

app.factory('myHttpInterceptor', function($q, $location) {
  // $httpProvider.interceptors.push(function($q, $location) {
    return {
      'responseError': function(rejection) {
        if (rejection.status === 401) {
          $location.path('/login');
        }
        return $q.reject(rejection);
      }
    
  }
})