'use strict';

/* Directives */

function fileToDataURLp($q, file) {
  var dataURLd = $q.defer();
  var reader = new FileReader();
  reader.onload = function(e) {
    dataURLd.resolve(e.target.result);
  };
  reader.readAsDataURL(file);

  return dataURLd.promise;
}

angular.module('myApp.directives', []).
  directive('myFiles', ['$q', function($q) {
    return {
      scope: {
        files: '=myFiles'
      },
      link: function(scope, element, attr) {
        element.on('change', function() {
          var promise = attr.multiple ?
              $q.all(Array.prototype.map.call(
                element[0].files,
                function(file) { return fileToDataURLp($q, file); })) :
              fileToDataURLp($q, element[0].files[0]);
          scope.$apply(function() {
            promise.then(function(files) { scope.files = files; })
          });
        });
      }
    };
  }]);
