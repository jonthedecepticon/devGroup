'use strict';

describe('Controller: ThreadctrlCtrl', function () {

  // load the controller's module
  beforeEach(module('100App'));

  var ThreadctrlCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ThreadctrlCtrl = $controller('ThreadctrlCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
