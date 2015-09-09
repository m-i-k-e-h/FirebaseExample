angular.module('firebaseExample.services')

.factory('Posts', function() {

  var baseUrl = 'https://zukfirebaseexample.firebaseio.com/';
  var postsUrl = baseUrl + 'posts/'
  var firebaseRef = new Firebase(baseUrl);
  var postListRef = new Firebase(postsUrl);
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
      postListRef.push(form);
    },

    removePost: function(key, callback) {
      postListRef.child(key).remove(callback);
    },

    registerPostObserver: function(observer) {
      postListRef.on('value', observer);
    },

    // For testing
    baseRef: function() {
      return firebaseRef;
    },

    postRef: function() {
      return postListRef;
    }
  };
});
