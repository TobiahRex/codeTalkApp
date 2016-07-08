'use strict';

angular.module('fullStackTemplate')
.controller('mainController', function($scope, $state, Auth, ngSocket){
  let yo = 'yo!';
  ngSocket.emit('hello', yo);


  function loginCheck(){
    Auth.getProfile()
    .then(res => {
      $scope.currentUser = res.data;
    })
    .catch(err => {
      $scope.currentUser = null;
      $state.go('login');
    });
  };

  loginCheck();

  $scope.$on('loggedIn', function(){loginCheck()});
  $scope.$on('loggedOut', function(){loginCheck()});

});
