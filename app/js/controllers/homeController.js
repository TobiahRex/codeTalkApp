'use strict';

angular.module('fullStackTemplate')
.controller('homeController', function($scope, $state, $uibModal, toastr, Comment, Auth){
  console.log('homeCtrl');

  let dbComments = () =>{
    Comment.getComments()
    .then(res=>{
      let comments = {user : [], other : []};
      res.data.forEach(comment=>{
        comment.UserId === $scope.currentUser._id
        ? comments.user.push(comment)
        : comments.other.push(comment);
        $scope.comments = comments;
      });
    })
    .catch(err => $scope.comments = err);
  };
  let dbUsers = () =>{
    Auth.getUsers()
    .then(res => $scope.users = res.data)
    .catch(err => $scope.users = err);
  };

  dbComments();
  dbUsers();

  $scope.showMsgBoard = () => {
    $scope.allUsers = false;
    $scope.commentBoard = true;
    $scope.comments = dbComments();
  };

  $scope.showUsers = () => {
    $scope.commentBoard = false;
    $scope.allUsers = true;
    $scope.users = dbUsers();
  };

  $scope.showSuccessMsg = () => toastr.success('Your information has been saved successfully!');
  $scope.showInfoMsg = () => toastr.info("You've got a new email!", 'Information');
  $scope.showErrorMsg = () => toastr.error("Your information hasn't been saved!", 'Error');
  $scope.showWarningMsg = () => toastr.warning('Your computer is about to explode!', 'Warning');
});
