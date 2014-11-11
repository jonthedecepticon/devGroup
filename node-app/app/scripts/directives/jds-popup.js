'use strict';

angular.module('100App')
  .directive('jdsPopup', function ($timeout) {
    // console.log('you made it into the jdsPopup directive');
    return {
      templateUrl: '/views/modal.html',
      restrict: 'A',
      transclude: true,
      link: function postLink(scope, element, attrs) {
      	$timeout(function function_name (argument) {
	      	var selector = attrs.jdsPopup,
	        	targets = angular.element(document.body).find(selector);

	        targets.on('click', function(){
	        	console.log("you just clicked into jdsPopup directive");
	        	// use when not using bootstrap modal //
            // element.find('.popup').toggle();

            //bootstrap modal
            $('#modal').modal('show');
            $('#myModal').on('hidden.bs.modal', function () {
            })
	        });
      	}, 2000);


        
      }
    };
  });
