'use strict';

angular.module('fullStackTemplate')
.controller('profileController', function($state, $scope, Auth, dbProfile, dbMessages){
  console.log('profileCtrl');

  $scope.profile = dbProfile;
  $scope.messages = dbMessages;
});
