angular.module('firebaseExample', ['ionic', 'firebase', 'firebaseExample.controllers', 'firebaseExample.services'])

.run(function($ionicPlatform, $rootScope, $window, $ionicLoading) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        $rootScope.show = function(text) {
            $rootScope.loading = $ionicLoading.show({
                content: text ? text : 'Loading..',
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        };

        $rootScope.hide = function() {
            $ionicLoading.hide();
        };

        $rootScope.notify = function(text) {
            $rootScope.show(text);
            $window.setTimeout(function() {
                $rootScope.hide();
            }, 1999);
        };
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('user', {
            url: "/user",
            abstract: true,
            templateUrl: "templates/user.html"
        })
        .state('user.signin', {
            url: '/signin',
            views: {
                'signin': {
                    templateUrl: 'templates/signin.html',
                    controller: 'SignInCtrl'
                }
            }
        })
        .state('user.signup', {
            url: '/signup',
            views: {
                'signup': {
                    templateUrl: 'templates/signup.html',
                    controller: 'SignUpCtrl'
                }
            }
        })
        .state('posts', {
            url: "/posts",
            abstract: true,
            templateUrl: "templates/posts.html"
        })
        .state('posts.list', {
            url: '/list',
            views: {
                'posts-list': {
                    templateUrl: 'templates/posts-list.html',
                    controller: 'myListCtrl'
                }
            }
        })
    $urlRouterProvider.otherwise('/user/signin');
});

angular.module('firebaseExample.controllers', []);
