angular.module('firebaseExample.services')

.factory('Notify', function($ionicLoading, $window) {

  var NotifyFunctions = {
    show: function(text) {
      $ionicLoading.show({
        template: text ? text : 'Loading..'
      });
    },

    hide: function() {
      $ionicLoading.hide();
    },

    notify: function(text) {
      NotifyFunctions.show(text);
      $window.setTimeout(function() {
        NotifyFunctions.hide();
      }, 1999);
    }
  };

  return NotifyFunctions;
});
