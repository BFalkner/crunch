'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('ImageResizeCtrl', ['$scope', function($scope) {
    $scope.size = { width: 300, height: 300 }

  }]);
