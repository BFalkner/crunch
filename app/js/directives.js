'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('myFiles', ['$q', '$sce', function($q, $sce) {
    return {
      scope: {
        files: '=myFiles'
      },
      link: function(scope, element, attr) {
        element.on('change', function() {
          var fileToDataURLp = function(file) {
                var dataURLd = $q.defer();
                var reader = new FileReader();
                reader.onload = function(e) {
                  dataURLd.resolve(e.target.result);
                };
                reader.readAsDataURL(file);

                return dataURLd.promise;
              },
              trustURL = function(url) { return $sce.trustAs('resourceUrl', url); },
              promise = attr.multiple ?
              $q.all(Array.prototype.map.call(
                element[0].files,
                function(file) { return fileToDataURLp(file).then(trustURL); })) :
              fileToDataURLp(element[0].files[0]).then(trustURL);
          scope.$apply(function() {
            promise.then(function(files) { scope.files = files; })
          });
        });
      }
    };
  }])

  .directive('resizedImage', ['imageTools', function(imageTools) {
    function newSize(originalSize, maxSize) {
      var oAspectRatio = originalSize.width / originalSize.height,
          maxAspectRatio = maxSize.width / maxSize.height,
          targetDimension = oAspectRatio > maxAspectRatio ? "width" : "height",
          modRatio = maxSize[targetDimension] / originalSize[targetDimension];

      return {
        width: Math.round(originalSize.width * modRatio),
        height: Math.round(originalSize.height * modRatio)
      }
    }

    return {
      template: '<img width="{{width}}" height="{{height}}" ng-src="{{src}}" />',
      restrict: 'E',
      scope: {
        maxWidth: '=',
        maxHeight: '='
      },
      link: function(scope, element, attr) {
        scope.imageP = imageTools.imageP(attr.ngSrc);

        scope.$watch(
          function() { return [scope.maxWidth, scope.maxHeight]; },
          function() {
            var maxSize = { width: scope.maxWidth, height: scope.maxHeight },
                sizeP = scope.imageP.then(function(image) {
                  return newSize({ width: image.width, height: image.height }, maxSize);
                });

            sizeP.then(function(size) {
              scope.width = size.width;
              scope.height = size.height;
            });
          },
          true
        );

        scope.$watch(
          function() { return [scope.width, scope.height]; },
          function() {
            scope.imageP.then(function(image) {
              return imageTools.resizeURLP(image, { width: scope.width, height: scope.height });
            }).then(function(url) {
              scope.src = url;
            });;
          },
          true
        )
      }
    };
  }]);
