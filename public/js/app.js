var app = angular.module('groupDropper', ['ngRoute', 'ngResource', 'ngCookies', 'angulike'])

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
		templateUrl: 'views/profile.html',
		controller: 'userControl'
	})
	.when('/login', {
		templateUrl: 'views/login.html',
		controller: 'userControl'
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
	.when('/products/:productId/checkout', {
		templateUrl: 'views/checkout.html',
		controller: 'checkoutControl',
		resolve: {
			product: function(productService, $route) {
				return productService.getProduct($route.current.params.productId)
			}
		}
	})
	.otherwise({
		redirectTo: '/products'
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