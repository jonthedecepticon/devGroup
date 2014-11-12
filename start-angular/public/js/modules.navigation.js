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

    angular.module('myApp.modules.navigation', [])
		
		.controller('NavigationCtrl', [
			'$scope', '$location',
			function ($scope, $location) {
				$scope.$location = $location
			}])
		;

	}
));
