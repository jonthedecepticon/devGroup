'use strict';

angular.module('100App')
  .controller('FilterCtrl', function ($scope) {
    
    var ButtonsCtrl = function ($scope) {
      $scope.singleModel = 1;

      $scope.radioModel = 'Middle';

      $scope.checkModel = {
        left: false,
        middle: true,
        right: false
      };
    };
  });
