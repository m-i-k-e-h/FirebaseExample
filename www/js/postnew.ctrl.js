angular.module('firebaseExample.controllers')

.controller('newCtrl', function($rootScope, $scope, $window, Posts) {
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
        $rootScope.show();

        $rootScope.show("Please wait... Creating new");

        Posts.createPost(item);
        $rootScope.hide();

    };
})
