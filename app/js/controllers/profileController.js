'use strict';

angular.module('fullStackTemplate')
.controller('profileController', function($state, $scope, Auth, dbProfile){
  console.log('profileCtrl');

  $scope.profile = dbProfile.data;

  $scope.newItems = () => $scope.$broadcast('getNewItems'); // listener @ newItemController
});
