angular.module('firebaseExample.services')

.factory('Posts', function($firebase) {

  var baseUrl = 'https://zukfirebaseexample.firebaseio.com/';
  var postsUrl = baseUrl + 'posts/'
  var firebaseRef = new Firebase(baseUrl);
  var fbEmail = null;

  return {
    login: function(email, password, callback) {
      fbEmail = email;
      return firebaseRef.authWithPassword({
        email: email,
        password: password
      }, callback);
    },

    logout: function() {
      fbEmail = null;
      firebaseRef.unauth();
    },

    createUser: function(email, password, callback) {
      fbEmail = email;
      firebaseRef.createUser({
        email: email,
        password: password
      }, callback);
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
