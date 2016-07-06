'use strict';

angular.module('fullStackTemplate')
.controller('logoutController', function($scope, $state, Auth, toastr){
  console.log('logoutCtrl');

  Auth.logoutUser()
  .then(res=> {
    toastr.info('You have successfully been logged out.', 'Logged Out', {iconClass : 'toast-info-toby'})
    $scope.$emit('loggedOut')
  });
});
