angular.module('firebaseExample.services', [])

.factory('Posts', function($firebaseAuth, $firebase) {

  var baseUrl = 'https://zukfirebaseexample.firebaseio.com/';
  var postsUrl = baseUrl + 'posts/'
  var fbAuthRef = new Firebase(baseUrl);
  var fbAuth = $firebaseAuth(fbAuthRef);
  var fbEmail = null;

  return {
    login: function(email, password) {
      fbEmail = email;
      return fbAuth.$login('password', {
        email: email,
        password: password
      });
    },

    logout: function() {
      fbEmail = null;
      fbAuth.$logout();
    },

    createUser: function(email, password, callback) {
      fbEmail = email;
      fbAuth.$createUser(email, password, callback);
    },

    createPost: function(post) {
      var form = {
        item: post,
        created: Date.now(),
        user: fbEmail
      };

      var postRef = new Firebase(postsUrl);
      $firebase(postRef).$add(form);
    },

    removePost: function(key, callback) {
      var postListRef = new Firebase(postsUrl);
      postListRef.child(key).remove(callback);
    },

    registerPostObserver: function(observer) {
      var postListRef = new Firebase(postsUrl);
      postListRef.on('value', observer);
    }
  };
});
