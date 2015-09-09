angular.module('firebaseExample.controllers')

.controller('PostListCtrl', function($scope, $window, $ionicModal, Posts, Notify) {
  Notify.show("Please wait... Processing");
  $scope.list = [];

  Posts.registerPostObserver(function(snapshot) {
    var data = snapshot.val();
    $scope.list = [];

    _.forEach(data, function(val, key) {
      $scope.list.push(_.assign(val, {key: key}));
    });

    if ($scope.list.length == 0) {
      $scope.noData = true;
    } else {
      $scope.noData = false;
    }
    Notify.hide();
  });

  $ionicModal.fromTemplateUrl('templates/newItem.html', function(modal) {
    $scope.newTemplate = modal;
  });

  $scope.newTask = function() {
    $scope.newTemplate.show();
  };

  $scope.deleteItem = function(key) {
    Notify.show("Please wait... Deleting from List");
    Posts.removePost(key, function(error) {
      if (error) {
        Notify.hide();
        Notify.notify('Oops! something went wrong. Try again later');
      } else {
        Notify.hide();
        Notify.notify('Successfully deleted');
      }
    });
  };

  $scope.logout = function() {
    Posts.logout();
    $window.location.href = '#/auth/signin';
  };
})
