describe('SigninControllerTest', function(){
  var myScope;

  var mockNotify = {
    notify: function() {},
    hide: function() {},
    show: function() {}
  };

  var userLoginError;
  var userLoginUser;
  var mockPosts = {
    login: function(email, password, callback) {
      callback(userLoginError, userLoginUser);
    }
  };

  // load the controller's module
  beforeEach(module('firebaseExample.controllers', function($provide) {
    $provide.service('Notify', mockNotify);
    $provide.service('Posts', mockPosts);
    userLoginError = undefined;
    userLoginUser = undefined;
  }));

  beforeEach(inject(function($rootScope, $controller, $window) {
    myScope = $rootScope.$new();

    $controller('SignInCtrl', {
      $scope: myScope,
      $window: $window,
      Posts: mockPosts,
      Notify: mockNotify
    });

  }));

  it('should instatiate user details to empty strings', function() {
    expect(myScope.user.email).toEqual("");
    expect(myScope.user.password).toEqual("");
  });

  it('should refuse if no credentials', function() {
    myScope.user = {
      email: "",
      password: ""
    };
    spyOn(mockNotify, 'notify');
    expect(myScope.validateUser()).toEqual(false);
    expect(mockNotify.notify).toHaveBeenCalledWith("Please enter valid credentials");
  });

  it('should refuse if no password', function() {
    myScope.user = {
      email: "test@test.com",
      password: ""
    };
    spyOn(mockNotify, 'notify');
    expect(myScope.validateUser()).toEqual(false);
    expect(mockNotify.notify).toHaveBeenCalledWith("Please enter valid credentials");
  });

  it('should refuse if no email', function() {
    myScope.user = {
      email: "",
      password: "secret"
    };
    spyOn(mockNotify, 'notify');
    expect(myScope.validateUser()).toEqual(false);
    expect(mockNotify.notify).toHaveBeenCalledWith("Please enter valid credentials");
  });

  it('should refuse if invalid email', function() {
    myScope.user = {
      email: "test@test.com",
      password: "secret"
    };
    spyOn(mockNotify, 'show');
    spyOn(mockNotify, 'hide');
    spyOn(mockNotify, 'notify');
    userLoginError = { code: 'INVALID_EMAIL'};
    myScope.validateUser();
    expect(mockNotify.show).toHaveBeenCalledWith("Please wait.. Authenticating");
    expect(mockNotify.hide).toHaveBeenCalled();
    expect(mockNotify.notify).toHaveBeenCalledWith("Invalid Email Address");
  });

  it('should refuse if already used email', function() {
    myScope.user = {
      email: "test@test.com",
      password: "secret"
    };
    spyOn(mockNotify, 'show');
    spyOn(mockNotify, 'hide');
    spyOn(mockNotify, 'notify');
    userLoginError = { code: 'INVALID_USER'};
    myScope.validateUser();
    expect(mockNotify.show).toHaveBeenCalledWith("Please wait.. Authenticating");
    expect(mockNotify.hide).toHaveBeenCalled();
    expect(mockNotify.notify).toHaveBeenCalledWith("Invalid User");
  });

  it('should refuse if already used email', function() {
    myScope.user = {
      email: "test@test.com",
      password: "secret"
    };
    spyOn(mockNotify, 'show');
    spyOn(mockNotify, 'hide');
    spyOn(mockNotify, 'notify');
    userLoginError = { code: 'INVALID_PASSWORD'};
    myScope.validateUser();
    expect(mockNotify.show).toHaveBeenCalledWith("Please wait.. Authenticating");
    expect(mockNotify.hide).toHaveBeenCalled();
    expect(mockNotify.notify).toHaveBeenCalledWith("Invalid Password");
  });

  it('should refuse if unknown error', function() {
    myScope.user = {
      email: "test@test.com",
      password: "secret"
    };
    spyOn(mockNotify, 'show');
    spyOn(mockNotify, 'hide');
    spyOn(mockNotify, 'notify');
    userLoginError = { code: 'ERROR'};
    myScope.validateUser();
    expect(mockNotify.show).toHaveBeenCalledWith("Please wait.. Authenticating");
    expect(mockNotify.hide).toHaveBeenCalled();
    expect(mockNotify.notify).toHaveBeenCalledWith("Oops something went wrong. Please try again later");
  });


  it('should navigate to list if good credentials', inject(function($window) {
    myScope.user = {
      email: "test@test.com",
      password: "secret"
    };
    spyOn(mockNotify, 'show');
    spyOn(mockNotify, 'hide');
    spyOn(mockNotify, 'notify');
    userLoginUser = myScope.user;
    myScope.validateUser();
    expect(mockNotify.show).toHaveBeenCalledWith("Please wait.. Authenticating");
    expect(mockNotify.hide).toHaveBeenCalled();
    expect($window.location.href.match(/.*\/posts\/list/)).toBeTruthy();
  }));
});
