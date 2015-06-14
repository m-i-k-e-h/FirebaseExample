angular.module('firebaseExample.controllers')

.controller('SignUpCtrl',
function($scope, $window, Posts, Notify) {

  $scope.user = {
    email: "",
    password: ""
  };
  $scope.createUser = function() {
    var email = this.user.email;
    var password = this.user.password;
    if (!email || !password) {
      Notify.notify("Please enter valid credentials");
      return false;
    }
    Notify.show('Please wait.. Registering');

    Posts.createUser(email, password, function(error, user) {
      if (!error) {
        Notify.hide();
        $window.location.href = ('#/posts/list');
      } else {
        Notify.hide();
        if (error.code == 'INVALID_EMAIL') {
          Notify.notify('Invalid Email Address');
        } else if (error.code == 'EMAIL_TAKEN') {
          Notify.notify('Email Address already taken');
        } else {
          Notify.notify('Oops something went wrong. Please try again later');
        }
      }
    });
  }
}
)
