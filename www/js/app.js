angular.module('samaritnApp', ['ionic', 'samaritnApp.controllers'])
// run() block
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
// config() block
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('hazrrd', {
      url: '/hazrrd',
      //abstract: true,
      //templateUrl: 'templates/menu.html',
      templateUrl: 'templates/loginView.html'
    })

    .state('hazrrd.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'templates/loginView.html',
          controller: 'LoginController'
        }
      }
    })

    .state('hazrrd.map', {
      url: '/user',
      views: {
        'menuContent': {
          templateUrl: 'templates/userMapView.html',
          controller: 'UserController'
        }
      }
    })
    .state('hazrrd.driver', {
      url: '/driver',
      views: {
        'menuContent': {
          templateUrl: 'templates/driverMapView.html',
          controller: 'AssistantController'
        }
      }
    });
  $urlRouterProvider.otherwise('/hazrrd');
});