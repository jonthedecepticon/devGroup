'use strict';

describe('Filter: object2Array', function () {

  // load the filter's module
  beforeEach(module('100App'));

  // initialize a new instance of the filter before each test
  var object2Array;
  beforeEach(inject(function ($filter) {
    object2Array = $filter('object2Array');
  }));

  it('should return the input prefixed with "object2Array filter:"', function () {
    var text = 'angularjs';
    expect(object2Array(text)).toBe('object2Array filter: ' + text);
  });

});
