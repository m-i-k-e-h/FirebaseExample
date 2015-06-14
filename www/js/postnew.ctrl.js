angular.module('firebaseExample.controllers')

.controller('newCtrl', function($scope, $window, Posts, Notify) {
    $scope.data = {
        item: ""
    };

    $scope.close = function() {
        $scope.modal.hide();
    };

    $scope.createNew = function() {
        var item = this.data.item;
        if (!item) return;
        $scope.modal.hide();
        Notify.show();

        Notify.show("Please wait... Creating new");

        Posts.createPost(item);
        Notify.hide();
    };
})
