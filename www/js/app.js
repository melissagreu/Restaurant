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

    $stateProvider.state('map',{
        url:'/map',
        templateUrl:'templates/map.html'
    })

    $stateProvider.state('login',{
        url:'/login',
        templateUrl:'templates/login/login.html'
    })

    $stateProvider.state('inscription',{
        url:'/inscription',
        templateUrl:'templates/register/inscription.html'
    })

    $urlRouterProvider.otherwise('/home')
})

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
});

app.controller("MapController", function($scope, $ionicLoading, $compile, FURL, FURLR){

    $scope.firebase = new Firebase(FURLR);
    $scope.restos = {};

   /* $scope.firebase.on('value', function(snapshot) {
        $scope.$apply();
        $scope.restos = snapshot.val();
        snapshot.forEach(function(data) {
           console.log(data.val().Name);
        });

    });*/

    console.log($scope.restos);


    function initialize() {
        var myLatlng = new google.maps.LatLng(48.8590507,2.3211163);

        var mapOptions = {
            center: myLatlng,
            zoom: 11,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a>Paris</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
            content: compiled[0]
        });

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Uluru (Ayers Rock)',
        });
        $scope.firebase.on('value', function(snapshot) {
            $scope.$apply();
            $scope.restos = snapshot.val();
            snapshot.forEach(function(data) {
                var marker = new google.maps.Marker({
                    position: {lat: data.val().latitude, lng: data.val().longitude},
                    map: map,
                    title: data.val().Name
                });
                console.log(data.val().url);
                if(data.val().url === "")
                {
                    var contentString = "<div><p ng-click='clickTest()'>"+data.val().Name+"</p></div>";
                    var compiled = $compile(contentString)($scope);
                    
                } else {
                    var contentString = "<div><a ui-sref='"+data.val().url+"'>"+data.val().Name+"</a><p>"+data.val().description+"</p></div>";
                    var compiled = $compile(contentString)($scope);
                }

                var infowindow = new google.maps.InfoWindow({
                    content: compiled[0]
                });
                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });
            });

        });

        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
        });

        $scope.map = map;

    };
    initialize();
    google.maps.event.addDomListener(window, 'load', initialize);


    $scope.centerOnMe = function() {
        if(!$scope.map) {
            return;
        }
        $scope.loading = $ionicLoading.show({
            content: 'Getting current location...',
            showBackdrop: false
        });
        navigator.geolocation.getCurrentPosition(function(pos) {
            $scope.latpos = pos.coords.latitude;
            $scope.lngpos = pos.coords.longitude;
            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            $ionicLoading.hide();
            var myMarker = new google.maps.Marker({
                position: $scope.map.getCenter(),
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                icon: "../img/pointbleu.png"
            });
        }, function(error) {
            alert('Unable to get location: ' + error.message);
        });
        var contentString = "<div><p>Vous êtes ici</p></div>";
        var compiled = $compile(contentString)($scope);
        var infowindow = new google.maps.InfoWindow({
            content: compiled[0]
        });
    };

    $scope.addMarker = function () {
        if(!$scope.map) {
            return;
        }
        if ($scope.titleMarker == "") {
            $scope.titled = "Pas de nom";
        } else {
            $scope.titled = $scope.titleMarker;
        }
        var myMarker = new google.maps.Marker({
            position: $scope.map.getCenter(),
            map: $scope.map,
            animation: google.maps.Animation.DROP
        });
        $scope.firebase.push({
            Name:$scope.titled,
            type:$scope.restoType,
            latitude:$scope.map.data.map.center.lat(),
            longitude:$scope.map.data.map.center.lng(),
            url: "",
            description: ""
        });
        $scope.titleMarker = "";
        $scope.restoType = "Burger";
    };

    $scope.clickTest = function() {
        alert("Restaurant entré manuellement")
    };


    $scope.firebase.on('value', function(snapshot) {
        $scope.$apply();
        $scope.restos = snapshot.val();
        snapshot.forEach(function(data) {
            var marker = new google.maps.Marker({
                position: {lat: data.val().latitude, lng: data.val().longitude},
                map: map
            });
            var contentString = "<div><a ui-sref='"+data.val().url+"'>"+data.val().Name+"</a></div><p>"+data.val().description+"</p>";
            var compiled = $compile(contentString)($scope);

            var infowindow = new google.maps.InfoWindow({
                content: compiled[0]
            });
        });

    });
})

.constant('FURL', 'https://apprest.firebaseio.com/')
.constant('FURLR', 'https://apprest.firebaseio.com/restaurants/')