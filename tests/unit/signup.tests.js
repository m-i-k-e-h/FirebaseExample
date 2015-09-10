describe('SignupControllerTest', function(){
  var myScope;

  var mockNotify = {
    notify: function() {},
    hide: function() {},
    show: function() {}
  };

  var userCreateError;
  var userCreateUser;
  var mockPosts = {
    createUser: function(email, password, callback) {
      callback(userCreateError, userCreateUser);
    }
  };

  // load the controller's module
  beforeEach(module('firebaseExample.controllers', function($provide) {
    $provide.service('Notify', mockNotify);
    $provide.service('Posts', mockPosts);
    userCreateError = undefined;
    userCreateUser = undefined;
  }));

  beforeEach(inject(function($rootScope, $controller, $window) {
    myScope = $rootScope.$new();

    $controller('SignUpCtrl', {
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
    expect(myScope.createUser()).toEqual(false);
    expect(mockNotify.notify).toHaveBeenCalledWith("Please enter valid credentials");
  });

  it('should refuse if no password', function() {
    myScope.user = {
      email: "test@test.com",
      password: ""
    };
    spyOn(mockNotify, 'notify');
    expect(myScope.createUser()).toEqual(false);
    expect(mockNotify.notify).toHaveBeenCalledWith("Please enter valid credentials");
  });

  it('should refuse if no email', function() {
    myScope.user = {
      email: "",
      password: "secret"
    };
    spyOn(mockNotify, 'notify');
    expect(myScope.createUser()).toEqual(false);
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
    userCreateError = { code: 'INVALID_EMAIL'};
    myScope.createUser();
    expect(mockNotify.show).toHaveBeenCalledWith("Please wait.. Registering");
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
    userCreateError = { code: 'EMAIL_TAKEN'};
    myScope.createUser();
    expect(mockNotify.show).toHaveBeenCalledWith("Please wait.. Registering");
    expect(mockNotify.hide).toHaveBeenCalled();
    expect(mockNotify.notify).toHaveBeenCalledWith("Email Address already taken");
  });

  it('should refuse if unknown error', function() {
    myScope.user = {
      email: "test@test.com",
      password: "secret"
    };
    spyOn(mockNotify, 'show');
    spyOn(mockNotify, 'hide');
    spyOn(mockNotify, 'notify');
    userCreateError = { code: 'ERROR'};
    myScope.createUser();
    expect(mockNotify.show).toHaveBeenCalledWith("Please wait.. Registering");
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
      userCreateUser = myScope.user;
      myScope.createUser();
      expect(mockNotify.show).toHaveBeenCalledWith("Please wait.. Registering");
      expect(mockNotify.hide).toHaveBeenCalled();
      expect($window.location.href.match(/.*\/posts\/list/)).toBeTruthy();
    }));
});
