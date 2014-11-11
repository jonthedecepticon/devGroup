'use strict';

angular.module('100App')
  .filter('object2Array', function () {
    return function(input) {
      var out = []; 
      for(var i in input){
        out.push(input[i]);
      }
      return out;
    }
  });




function property(){
    function parseString(input){
        return input.split(".");
    }
 
    function getValue(element, propertyArray){
        var value = element;
 
        _.forEach(propertyArray, function(property){
            value = value[property];
        });
 
        return value;
    }
 
    return function (array, propertyString, lastProperty, target, backwards){
        if(!lastProperty)
          return array;
        var properties = parseString(propertyString);
        properties.push(lastProperty);
        if(backwards === undefined)
          backwards = false;
        return _.filter(array, function(item){
          if(backwards)
            return getValue(item, properties) !== target;
          else
            return getValue(item, properties) === target;
        });
    }
}

angular.module('100App').filter('property', property);
 

