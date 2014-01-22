'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  factory('imageTools', ['$q', function($q) {
    return {
      urlToImageP: function(url) {
        var d = $q.defer(),
            image = new Image();

        image.onload = function() { d.resolve(image); };
        image.src = url;

        return d.promise;
      }
    };
  }]);
