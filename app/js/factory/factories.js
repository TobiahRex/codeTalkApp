'use strict';

var app = angular.module('fullStackTemplate');

app.factory('ngSocket', function (socketFactory) {
  var service = socketFactory();
  service.forward('error');
  return service;
});
