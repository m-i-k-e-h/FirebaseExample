describe('PostListControllerTest', function() {
  var myScope;

  var mockModal = {
    show: function() {}
  };

  var mockIonicModal = {
    fromTemplateUrl : function(url, callback) {
      callback(mockModal);
    }
  }

  var mockNotify = {
    notify: function() {},
    hide: function() {},
    show: function() {}
  };

  var mockPostsCallback = undefined;
  var mockPostsRemoveResult = undefined;
  var mockPostsKey = undefined;
  var mockPosts = {
    registerPostObserver: function(callback) {
      mockPostsCallback = callback;
    },
    removePost: function(key, callback) {
      mockPostsKey = key;
      callback(mockPostsRemoveResult);
    },
    logout: function() {}
  };


  // load the controller's module
  beforeEach(module('firebaseExample.controllers', function($provide) {
    $provide.service('Notify', mockNotify);
    $provide.service('Posts', mockPosts);
  }));

  beforeEach(inject(function($rootScope, $controller, $window) {
    myScope = $rootScope.$new();

    $controller('PostListCtrl', {
      $scope: myScope,
      $window: $window,
      $ionicModal: mockIonicModal,
      Posts: mockPosts,
      Notify: mockNotify
    });

  }));

  it('should instatiate post list as empty', function() {
    expect(myScope.list.length).toEqual(0);
  });

  it('should instatiate template modal', function() {
    expect(myScope.newTemplate).toEqual(mockModal);
  });

  it('should show template modal on new post', function() {
    spyOn(mockModal, 'show');
    myScope.newTask();
    expect(mockModal.show).toHaveBeenCalled();
  });

  it('should show success on post delete with no error', function() {
    spyOn(mockNotify, 'show');
    spyOn(mockNotify, 'hide');
    spyOn(mockNotify, 'notify');
    myScope.deleteItem("A Key");
    expect(mockNotify.show).toHaveBeenCalledWith("Please wait... Deleting from List");
    expect(mockPostsKey).toEqual("A Key");
    expect(mockNotify.hide).toHaveBeenCalled();
    expect(mockNotify.notify).toHaveBeenCalledWith('Successfully deleted');
  });

  it('should show failure on post delete with error', function() {
    spyOn(mockNotify, 'show');
    spyOn(mockNotify, 'hide');
    spyOn(mockNotify, 'notify');
    mockPostsRemoveResult = "Error";
    myScope.deleteItem("A Key");
    expect(mockNotify.show).toHaveBeenCalledWith("Please wait... Deleting from List");
    expect(mockPostsKey).toEqual("A Key");
    expect(mockNotify.hide).toHaveBeenCalled();
    expect(mockNotify.notify).toHaveBeenCalledWith('Oops! something went wrong. Try again later');
  });

  it('should logout of Posts on logout',inject(function($window) {
    spyOn(mockPosts, 'logout');
    myScope.logout();
    expect(mockPosts.logout).toHaveBeenCalled();
    expect($window.location.href.match(/.*\/auth\/signin/)).toBeTruthy();
  }));

  it('should set no data when sent empty post list', function() {
    spyOn(mockNotify, 'hide');
    var snapshot = {
      val: function() {
        return [];
      }
    };
    mockPostsCallback(snapshot);
    expect(myScope.list.length).toEqual(0);
    expect(myScope.noData).toEqual(true);
    expect(mockNotify.hide).toHaveBeenCalled();
  });

  it('should set data when sent populated post list', function() {
    spyOn(mockNotify, 'hide');
    var snapshot = {
      val: function() {
        return {
          'X': { item: 'A', user: '1'},
          'Y': { item: 'B', user: '2'},
          'Z': { item: 'C', user: '3'}
        };
      }
    };
    mockPostsCallback(snapshot);
    expect(myScope.list.length).toEqual(3);
    expect(myScope.list).toContain({ item: 'A', user: '1', key: 'X'});
    expect(myScope.list).toContain({ item: 'B', user: '2', key: 'Y'});
    expect(myScope.list).toContain({ item: 'C', user: '3', key: 'Z'});
    expect(myScope.noData).toEqual(false);
    expect(mockNotify.hide).toHaveBeenCalled();
  });
});
