'use strict';

angular.module('100App')
.directive('jdsMixItUp', function (){
        return{
            restrict: 'A',
            link: function(scope, element, attrs){
                var unwatch = scope.$watch(attrs.jdsMixItUp, function(val) {
                    if (val) {
                        element.mixItUp();
                        unwatch();
                    }
                });
            }
        };
    });
