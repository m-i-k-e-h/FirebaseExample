describe('PostNewControllerTest', function() {
  var myScope;

  var mockModal = {
    hide: function() {}
  };

  var mockNotify = {
    notify: function() {},
    hide: function() {},
    show: function() {}
  };

  var mockPosts = {
    createPost: function(post) {}
  };

  // load the controller's module
  beforeEach(module('firebaseExample.controllers', function($provide) {
    $provide.service('Notify', mockNotify);
    $provide.service('Posts', mockPosts);
  }));

  beforeEach(inject(function($rootScope, $controller, $window) {
    myScope = $rootScope.$new();
    myScope.modal = mockModal;

    $controller('NewPostCtrl', {
      $scope: myScope,
      $window: $window,
      Posts: mockPosts,
      Notify: mockNotify
    });

  }));

  it('should instatiate text data to empty string', function() {
    expect(myScope.data.item).toEqual("");
  });

  it('should close modal on close', function() {
    spyOn(myScope.modal, 'hide');
    myScope.close();
    expect(myScope.modal.hide).toHaveBeenCalled();
  });

  it('should not create if no text', function() {
    spyOn(mockNotify, 'show');
    spyOn(mockNotify, 'hide');
    spyOn(mockPosts, 'createPost');
    spyOn(myScope.modal, 'hide');
    myScope.createNew();
    expect(mockNotify.show).not.toHaveBeenCalled();
    expect(mockNotify.hide).not.toHaveBeenCalled();
    expect(mockPosts.createPost).not.toHaveBeenCalled();
    expect(myScope.modal.hide).not.toHaveBeenCalled();
  });

  it('should create if valid text', function() {
    spyOn(mockNotify, 'show');
    spyOn(mockNotify, 'hide');
    spyOn(mockPosts, 'createPost');
    spyOn(myScope.modal, 'hide');
    myScope.data.item = "Here is a post";
    myScope.createNew();
    expect(myScope.modal.hide).toHaveBeenCalled();
    expect(mockNotify.show).toHaveBeenCalledWith("Please wait... Creating new");
    expect(mockPosts.createPost).toHaveBeenCalledWith("Here is a post");
    expect(mockNotify.hide).toHaveBeenCalled();
  });
});
