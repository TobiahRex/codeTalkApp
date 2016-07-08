'use strict';
// TODO : create addLike route

angular.module('fullStackTemplate')
.service('Message', function($http){

  this.getMessages = _ => $http.get('/api/messages/populate');

  this.newMessage = (rUser, message, wUser) => $http.post(`/api/messages/${rUser}/new/${wUser}`, {message});

  this.newReply = (userId, replyObj) => $http.post(`/api/messages/${userId}/reply/${replyObj._id}`, replyObj.Body);

});
