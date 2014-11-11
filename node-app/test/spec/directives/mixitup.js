'use strict';

describe('Directive: mixitup', function () {

  // load the directive's module
  beforeEach(module('100App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<mixitup></mixitup>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the mixitup directive');
  }));
});
