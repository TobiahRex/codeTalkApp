'use strict';

angular.module('fullStackTemplate')
.controller('registerController', function($scope, $state, $timeout, Auth, Upload){
  console.log('registerCtrl');

  let userObj = {
    Access      :  'Not-Assigned'
  };

  $scope.uploadFiles = (file, errFiles) => {
    $scope.errFile = errFiles && errFiles[0];
    userObj.Avatar = {data : file, contentType : file.type};

    
    // console.log("userObj.Avatar: ", userObj.Avatar);
  };

  $scope.registerNewUser = registerObj => {
    //-pwd match
    if(registerObj.password !== registerObj._Password) return console.log('ERROR: Passwords do not match.');

    //-build userObj from registerObj
    userObj.Username  = registerObj.Username;
    userObj._Password = registerObj._Password;
    userObj.Email     = registerObj.Email;
    userObj.Bio       = registerObj.Bio;
    userObj.Avatar    = registerObj.Avatar;

    registerObj.name.split(' ').forEach((name, i) => {
      i === 0 ? userObj.Firstname = name :
      i === 1 ? userObj.Lastname = name :
      null;
    });

    //-submit
    console.log('userObj: ', userObj);
    Auth.registerUser(userObj)
    .then(dataObj => {
      $state.go('verify');
      $scope.$emit('loggedIn');
    })
    .catch(err => {
      console.log('register error: ', err.data);
      $state.go('register');
    })
  };
});
