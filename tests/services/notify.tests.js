describe('NotifyServiceTest', function() {

  var mockIonicLoading = {
    hide: function() {},
    show: function() {}
  };

  var notifyService;

  beforeEach(module('firebaseExample.services', function($provide) {
    $provide.value('$ionicLoading', mockIonicLoading);
  }));

  beforeEach(inject(function(Notify) {
    notifyService = Notify;
  }));

  it('should show template modal on show', function() {
    spyOn(mockIonicLoading, 'show');
    notifyService.show("");
    expect(mockIonicLoading.show).toHaveBeenCalledWith({ template: 'Loading..'});
  });

  it('should show template modal with text on show', function() {
    spyOn(mockIonicLoading, 'show');
    notifyService.show("Hello");
    expect(mockIonicLoading.show).toHaveBeenCalledWith({ template: 'Hello'});
  });

  it('should hide template modal on hide', function() {
    spyOn(mockIonicLoading, 'hide');
    notifyService.hide("");
    expect(mockIonicLoading.hide).toHaveBeenCalled();
  });

  it('should show template modal then hide on notify', inject(function($window) {
    spyOn(mockIonicLoading, 'show');
    spyOn(mockIonicLoading, 'hide');
    var requestedTimeout = undefined;
    spyOn($window,'setTimeout').and.callFake(function(callback, timeout){
      requestedTimeout = timeout;
      callback();
    });
    notifyService.notify("");
    expect(mockIonicLoading.show).toHaveBeenCalledWith({ template: 'Loading..'});
    expect(mockIonicLoading.hide).toHaveBeenCalled();
    expect(requestedTimeout).toEqual(1999);
  }));

  it('should show template modal with text then hide on notify', inject(function($window) {
    spyOn(mockIonicLoading, 'show');
    spyOn(mockIonicLoading, 'hide');
    var requestedTimeout = undefined;
    spyOn($window,'setTimeout').and.callFake(function(callback, timeout){
      requestedTimeout = timeout;
      callback();
    });
    notifyService.notify("Hello");
    expect(mockIonicLoading.show).toHaveBeenCalledWith({ template: 'Hello'});
    expect(mockIonicLoading.hide).toHaveBeenCalled();
    expect(requestedTimeout).toEqual(1999);
  }));

});
