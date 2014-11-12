(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'jquery',
            'angular'
        ], factory);
    } else {
        factory();
    }
}(function () {
    'use strict';

    angular.module('myApp.modules.api', [])
		
		.controller('ApiListCtrl', [
			'$scope',
			function ($scope) {
			}])
		.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
			$routeProvider
			  .when('/api', {
				templateUrl: 'views/api.html',
				controller: 'ApiListCtrl'
			  })
			  ;
			  $locationProvider.html5Mode(true);
		}]);

	}
));
