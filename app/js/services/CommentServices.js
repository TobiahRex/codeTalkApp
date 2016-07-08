'use strict';

angular.module('fullStackTemplate')
.service('Comment', function($http){

  this.getComments = _ => $http.get('/api/comments');

  this.newComment = (rUser, comment, wUser) => $http.post(`/api/comments/${rUser}/new/${wUser}`, {comment});

});
