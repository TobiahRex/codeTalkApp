'use strict';

angular.module('fullStackTemplate')
.controller('profileController', function($state, $scope, Auth, dbProfile, dbMessages){
  console.log('profileCtrl');

  $scope.profile = dbProfile;

  let $scope.messages = dbMessage.forEach(message => {
    let messages = {user : [], other : []};
    message._id === user._id
    ? messages.user.push(message)
    : messages.other.push(message);
    return messages;
  });
});
