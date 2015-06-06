angular.module('firebaseExample.controllers')

.controller('myListCtrl', function($rootScope, $scope, $window, $ionicModal, Posts) {
  $rootScope.show("Please wait... Processing");
  $scope.list = [];

  Posts.registerPostObserver(function(snapshot) {
    var data = snapshot.val();
    $scope.list = [];
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        data[key].key = key;
        $scope.list.push(data[key]);
      }
    }

    if ($scope.list.length == 0) {
      $scope.noData = true;
    } else {
      $scope.noData = false;
    }
    $rootScope.hide();
  });


  $ionicModal.fromTemplateUrl('templates/newItem.html', function(modal) {
    $scope.newTemplate = modal;
  });

  $scope.newTask = function() {
    $scope.newTemplate.show();
  };

  $scope.deleteItem = function(key) {
    $rootScope.show("Please wait... Deleting from List");
    Posts.removePost(key, function(error) {
      if (error) {
        $rootScope.hide();
        $rootScope.notify('Oops! something went wrong. Try again later');
      } else {
        $rootScope.hide();
        $rootScope.notify('Successfully deleted');
      }
    });
  };

  $scope.logout = function() {
    Posts.logout();
    $window.location.href = '#/auth/signin';
  };
})
