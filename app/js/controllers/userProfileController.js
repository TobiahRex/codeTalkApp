'use strict';
// TODO : Build state params for going to Messagers profile
// TODO : build Modals for new Message and Reply
// TODO : if this profile is not the logged in user, add "send message" button

angular.module('fullStackTemplate')
.controller('userProfileController', function($state, $scope, Auth, dbMessages, Message, $stateParams){
  console.log('userProfileController');
  let loginId = $scope.currentUser._id;
  let userId  = $stateParams.id;

  console.log('userId: ', $stateParams.id);
  $scope.profile = dbProfile;

  $scope.reply = reply => {
    Message.newReply(loginId, reply)
    .then(res=>getMessages())
    .catch(err=>console.log('newMessage Error: ', err))
  };

  $scope.goToProfile = userId => {
    $state.go(`user/${userId}`);
  };
  $scope.sendMessage = userId => {
    // this should be a modal
  };
  $scope.submitReply = (msgId, reply) =>{
    // this should be a modal
    //
    // let replyObj = {_id : msgId, Body : reply};
    // Message.newReply(loginId, replyObj)
    // .then(res=>getMessages())
    // .catch(err=>console.log('New Reply Error: ', err));
  };
  $scope.submitLike = msgId => {
    Message.addLike(msgId)
    .then(res=>getMessages())
    .catch(err=>console.log('New Like Error: ', err));
  };

  let getMessages = () => {
    Message.getMessages()
    .then(res=>filterMessages(res.data))
    .catch(err=>console.log('getMessage Error: ', err));
  };
  let filterMessages = (msgs) => {
    console.log('msgs ', msgs);
    $scope.messages = msgs.map(message => {
      let messages = {user : [], other : []};
      message.UserId._id === $scope.currentUser._id
      ? messages.user.push(message)
      : messages.other.push(message);
      console.log('$scope.messages', $scope.messages);
      return messages;
    });
  };
  filterMessages(dbMessages);
});
