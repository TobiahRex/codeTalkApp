'use strict';
angular.module('fullStackTemplate')
.controller('loginController', function($scope, $state, Auth, $auth){
  console.log('loginCtrl');

  $scope.loginUser = loginObj => {
    Auth.loginUser(loginObj)
    .then(dataObj =>{
      if(dataObj.status !== 200) return console.log('login failed.', dataObj.data);
      $scope.$emit('loggedIn');
      $state.go('profile');
    });
  };

  $scope.authenticate = provider => {
    $auth.authenticate(provider)
    .then(res => {
      $scope.$emit('loggedIn');
      $state.go('profile');
    })
    .catch(err=> {
      console.log("error: ", err);
      $state.go('login');
    });
  };

});
