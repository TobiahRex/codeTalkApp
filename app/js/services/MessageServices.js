'use strict';

angular.module('fullStackTemplate')
.service('Message', function($http){

  this.getMessages = _ => $http.get('/api/messages');

  this.newMessage = (rUser, message, wUser) => $http.post(`/api/messages/${rUser}/new/${wUser}`, {message});

});
