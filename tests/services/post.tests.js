describe('PostServiceTest', function() {

  var postService;

  beforeEach(module('firebaseExample.services', function($provide) {
    MockFirebase.override();
  }));

  beforeEach(inject(function(Posts) {
    postService = Posts;
  }));

  it('should receive new data when created and deleted', function() {
    var receivedData = undefined;
    postService.registerPostObserver(function(snapshot) {
      receivedData = snapshot.val();
    });

    postService.createPost('This is a post');
    postService.postRef().flush();
    expect(_.values(receivedData).length).toEqual(1);
    expect(_.values(receivedData)[0].item).toEqual('This is a post');
    expect(_.values(receivedData)[0].user).toEqual(null); // As not logged in
    expect(_.values(receivedData)[0].created > Date.now()-15 && _.values(receivedData)[0].created < Date.now()+15).toBeTruthy();

    postService.removePost(_.keys(receivedData)[0]);
    postService.postRef().flush();

    expect(_.values(receivedData).length).toEqual(0);
  });

  it('should create new users', function() {
    var userCreateSuccess = undefined;
    postService.createUser('test@testtest.com', 'password', function(error, user) {
      userCreateSuccess = user.uid;
    });

    postService.baseRef().changeAuthState({uid: 'test@testtest.com',});
    postService.baseRef().flush();
    expect(userCreateSuccess).toEqual("simplelogin:1");
  });

  it('should login and logout', function() {
    var loginUser = undefined;
    postService.login('test@my.com', 'pass', function(error, user) {
      loginUser = user.uid;
    });

    postService.baseRef().changeAuthState({uid: 'test@my.com',});
    postService.baseRef().flush();
    expect(loginUser).toEqual('test@my.com');

    postService.logout();
  });

});
