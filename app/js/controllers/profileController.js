'use strict';

angular.module('fullStackTemplate')
.controller('profileController', function($state, $scope, Auth, dbProfile, dbMessages, Message){
  console.log('profileCtrl');

  $scope.profile = dbProfile;

  $scope.reply = message => {
    Message.newMessage(message)
    .then(res=>)
  }

  let getMessages = () => {
    Message.getMessages()
    .then(res.data=>filterMessages(res.data))
    .catch(err=>console.log('getMessage Error: ', err));
  };
  let filterMessages = (msgs) => {
    $scope.messages = msgs.map(message => {
      let messages = {user : [], other : []};
      message._id === $scope.currentUser._id
      ? messages.user.push(message)
      : messages.other.push(message);
      return messages;
    });
  };
  filterMessages(dbMessages);
});
