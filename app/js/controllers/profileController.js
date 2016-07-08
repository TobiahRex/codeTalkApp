'use strict';

angular.module('fullStackTemplate')
.controller('profileController', function($state, $scope, Auth, dbProfile, dbMessages, Message){
  console.log('profileCtrl');
  $scope.profile = dbProfile;

  $scope.reply = reply => {
    Message.newReply($scope.currentUser._id, reply)
    .then(res=>getMessages())
    .catch(err=>console.log('newMessage Error: ', err))
  };

  $scope.goToProfile = userId => {
    $state.go(`user/${userId}`);
  };
  $scope.sendMessage = userId => {

  };
  $scope.submitComment = (msgId, comment) =>{

  };
  $scope.submitLike = msgId => {
    
  };

  let getMessages = () => {
    Message.getMessages()
    .then(res=>filterMessages(res.data))
    .catch(err=>console.log('getMessage Error: ', err));
  };
  let filterMessages = (msgs) => {
    $scope.messages = msgs.map(message => {
      let messages = {user : [], other : []};
      message.UserId._id === $scope.currentUser._id
      ? messages.user.push(message)
      : messages.other.push(message);
      return messages;
    });
  };
  filterMessages(dbMessages);
});
