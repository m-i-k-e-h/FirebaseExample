angular.module('firebaseExample.controllers')
.controller('SignInCtrl',
function($scope, $window, Posts, Notify) {

  $scope.user = {
    email: "",
    password: ""
  };
  $scope.validateUser = function() {
    var email = this.user.email;
    var password = this.user.password;
    if (!email || !password) {
      Notify.notify("Please enter valid credentials");
      return false;
    }
    Notify.show('Please wait.. Authenticating');

    Posts.login(email, password, function(error, user) {
      if(!error) {
        Notify.hide();
        $window.location.href = ('#/posts/list');
      } else {
        Notify.hide();
        if (error.code == 'INVALID_EMAIL') {
          Notify.notify('Invalid Email Address');
        } else if (error.code == 'INVALID_PASSWORD') {
          Notify.notify('Invalid Password');
        } else if (error.code == 'INVALID_USER') {
          Notify.notify('Invalid User');
        } else {
          Notify.notify('Oops something went wrong. Please try again later');
        }
      }
    });
  }
}
)
