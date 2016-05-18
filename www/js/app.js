// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('home',{
      url:'/home',
      templateUrl:'templates/home.html'
    })
    $stateProvider.state('about',{
      url:'/about',
      templateUrl:'templates/about.html'
    })

    $stateProvider.state('localisation',{
        url:'/localisation',
        templateUrl:'templates/localisation.html'
    })
    $stateProvider.state('resto1',{
        url:'/resto1',
        templateUrl:'templates/resto1.html'
    })
    $stateProvider.state('ambiance',{
        url:'/ambiance',
        templateUrl:'templates/ambiance.html'
    })

    $stateProvider.state('japonais',{
        url:'/japonais',
        templateUrl:'templates/japonais.html'
    })
    $urlRouterProvider.otherwise('/map')
})

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
});

app.controller("MapController", function($scope){
   google.maps.event.addDomListener(window, "load", function() {
       var myLatlng = new google.maps.LatLng(37.3000, -120.48333);

       var mapOptions = {
           center: myLatlng,
           zoom: 13,
           mapTypeId: google.maps.MapTypeId.ROADMAP
       };

       var map = new google.maps.Map(document.getElementById("map"), mapOptions);

       navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
       });

       $scope.map = map;

   });
});

