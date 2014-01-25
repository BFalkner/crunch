'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  service('imageTools', ['$q', '$timeout', function($q, $timeout) {
    var ImageTools = function() {};

    ImageTools.prototype.imageP = function(url) {
      var d = $q.defer(),
          image = new Image();

      image.onload = function() { d.resolve(image); };
      image.src = url;

      return d.promise;
    };

    ImageTools.prototype.resizeURLP = function(image, newSize) {
      var d = $q.defer(),
          self = this;

      $timeout(function() {
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');

        canvas.width = newSize.width;
        canvas.height = newSize.height;

        ctx.drawImage(image, 0, 0, newSize.width, newSize.height);

        d.resolve(canvas.toDataURL());
      });

      return d.promise;
    };

    ImageTools.prototype.pixelArray = function(image) {
      var canvas = document.createElement('canvas'),
          ctx = canvas.getContext('2d'),
          width = image.width,
          height = image.height;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(image, 0, 0, width, height);

      var data = ctx.getImageData(0, 0, width, height).data,
          pixelArray = new Array(height),
          index;

      for (var row = 0; row < height; row++) {
        pixelArray[row] = new Array(width);
        for (var col = 0; col < width; col++) {
          index = (row * width + col) << 2;
          pixelArray[row][col] =
            (data[index + 3] << 24) +
            (data[index + 2] << 16) +
            (data[index + 1] << 8) +
            data[index];
        }
      }

      return pixelArray;
    };

    ImageTools.prototype.pixelArrayToURL = function(pixelArray) {
      var canvas = document.createElement('canvas'),
          width = pixelArray[0].length,
          height = pixelArray.length;

      canvas.width = width;
      canvas.height = height;

      var ctx = canvas.getContext('2d'),
          imageData = ctx.getImageData(0, 0, width, height),
          data = imageData.data,
          index, value, alpha;

      for (var row = 0; row < height; row++) {
        for (var col = 0; col < width; col++) {
          value = pixelArray[row][col];
          index = (row * width + col) << 2;
          alpha = (value & 0xFF000000) >> 24;
          data[index + 3] = alpha < 0 ? alpha + 256 : 0;
          data[index + 2] = (value & 0x00FF0000) >> 16;
          data[index + 1] = (value & 0x0000FF00) >> 8;
          data[index]     =  value & 0x000000FF;
        }
      }

      ctx.putImageData(imageData, 0, 0);

      return canvas.toDataURL();
    }

    return new ImageTools();
  }]);
