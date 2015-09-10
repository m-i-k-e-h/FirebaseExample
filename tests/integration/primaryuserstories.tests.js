describe('PrimaryUserStoriesIntegrationTest', function(){
  var myScope;

  var mockIonicLoading = {
    hide: function() {},
    show: function() {}
  };

  var mockModal = {
    show: function() {},
    hide: function() {}
  };

  var mockIonicModal = {
    fromTemplateUrl : function(url, callback) {
      callback(mockModal);
    }
  }

  var notifyService;
  var postsService;

  beforeEach(module('firebaseExample.services', function($provide) {
    MockFirebase.override();
    $provide.value('$ionicLoading', mockIonicLoading);
  }));

  beforeEach(module('firebaseExample.controllers', function($provide) {
  }));

  beforeEach(inject(function(Posts, Notify) {
    postsService = Posts;
    notifyService = Notify;
  }));

  beforeEach(inject(function($rootScope, $controller, $window) {
    myScope = $rootScope.$new();
    myScope.modal = mockModal;

    $controller('SignInCtrl', {
      $scope: myScope,
      $window: $window,
      Posts: postsService,
      Notify: notifyService
    });

    $controller('SignUpCtrl', {
      $scope: myScope,
      $window: $window,
      Posts: postsService,
      Notify: notifyService
    });

    $controller('PostListCtrl', {
      $scope: myScope,
      $window: $window,
      $ionicModal: mockIonicModal,
      Posts: postsService,
      Notify: notifyService
    });

    $controller('NewPostCtrl', {
      $scope: myScope,
      $window: $window,
      Posts: postsService,
      Notify: notifyService
    });
  }));

  it('should navigate to list on login', inject(function($window) {
    myScope.user = {
      email: "test@test.com",
      password: "secret"
    };
    spyOn(mockIonicLoading, 'show');
    spyOn(mockIonicLoading, 'hide');

    myScope.validateUser();
    expect(mockIonicLoading.show).toHaveBeenCalledWith({ template: "Please wait.. Authenticating"});

    // Prompt Firebase mock to respond with login
    postsService.baseRef().changeAuthState({uid: 'test@test.com',});
    postsService.baseRef().flush();

    expect(mockIonicLoading.hide).toHaveBeenCalled();
    expect($window.location.href.match(/.*\/posts\/list/)).toBeTruthy();
  }));

  it('should navigate to list on signup', inject(function($window) {
    myScope.user = {
      email: "test@test.com",
      password: "secret"
    };
    spyOn(mockIonicLoading, 'show');
    spyOn(mockIonicLoading, 'hide');
    myScope.createUser();
    expect(mockIonicLoading.show).toHaveBeenCalledWith({ template: "Please wait.. Registering"});

    // Prompt Firebase mock to respond with signup
    postsService.baseRef().changeAuthState({uid: 'test@test.com',});
    postsService.baseRef().flush();

    expect(mockIonicLoading.hide).toHaveBeenCalled();
    expect($window.location.href.match(/.*\/posts\/list/)).toBeTruthy();
  }));

  it('should navigate to front page on logout', inject(function($window) {
    myScope.logout();
    expect($window.location.href.match(/.*\/auth\/signin/)).toBeTruthy();
  }));

  it('should receive new data pushed from firebase', inject(function($window) {
    expect(myScope.list.length).toEqual(0);
    expect(myScope.noData).toEqual(true);

    var date = Date.now();
    postsService.postRef().push({
      item: 'Artifical Post',
      created:date,
      user: 'test@test.com'
    })
    postsService.postRef().flush();

    expect(myScope.list.length).toEqual(1);
    expect(myScope.noData).toEqual(false);
    expect((myScope.list)[0].item).toEqual('Artifical Post');
    expect((myScope.list)[0].user).toEqual('test@test.com');
    expect((myScope.list)[0].created).toEqual(date);
  }));

  it('should navigate to new post when requested', inject(function($window) {
    spyOn(mockModal, 'show');
    myScope.newPost();
    expect(mockModal.show).toHaveBeenCalled();
  }));

  it('should receive new data when created', inject(function($window) {
    expect(myScope.list.length).toEqual(0);
    expect(myScope.noData).toEqual(true);

    myScope.user = {
      email: "tester@test.com",
      password: "secret"
    };
    myScope.validateUser();

    myScope.data.item = 'An Actual Post';
    myScope.createNew();
    myScope.close();

    postsService.postRef().flush();

    expect(myScope.list.length).toEqual(1);
    expect(myScope.noData).toEqual(false);
    expect((myScope.list)[0].item).toEqual('An Actual Post');
    expect((myScope.list)[0].user).toEqual("tester@test.com");
    expect((myScope.list)[0].created > Date.now()-15 && (myScope.list)[0].created < Date.now()+15).toBeTruthy();
  }));

  it('should not receive new data when created empty', inject(function($window) {
    expect(myScope.list.length).toEqual(0);
    expect(myScope.noData).toEqual(true);

    myScope.user = {
      email: "tester@test.com",
      password: "secret"
    };
    myScope.validateUser();

    myScope.data.item = '';
    myScope.createNew();
    myScope.close();

    postsService.postRef().flush();

    expect(myScope.list.length).toEqual(0);
    expect(myScope.noData).toEqual(true);
  }));

  it('should receive new data when deleted', inject(function($window) {
    expect(myScope.list.length).toEqual(0);
    expect(myScope.noData).toEqual(true);

    var date = Date.now();
    postsService.postRef().push({
      item: 'Artifical Post to Delete',
      created:date,
      user: 'testDelete@test.com'
    })
    postsService.postRef().flush();

    expect(myScope.list.length).toEqual(1);
    expect(myScope.noData).toEqual(false);

    spyOn(mockIonicLoading, 'show');
    spyOn(mockIonicLoading, 'hide');
    var requestedTimeout = undefined;
    spyOn($window,'setTimeout').and.callFake(function(callback, timeout){
      requestedTimeout = timeout;
      callback();
    });

    myScope.deletePost((myScope.list)[0].key);
    expect(mockIonicLoading.show).toHaveBeenCalledWith({ template: "Please wait... Deleting from List"});

    postsService.postRef().flush();

    expect(mockIonicLoading.hide).toHaveBeenCalled();
    expect(mockIonicLoading.show).toHaveBeenCalledWith({ template: "Successfully deleted"});
    expect(mockIonicLoading.hide).toHaveBeenCalled();
    expect(requestedTimeout).toEqual(1999);

    expect(myScope.list.length).toEqual(0);
    expect(myScope.noData).toEqual(true);
  }));
});
