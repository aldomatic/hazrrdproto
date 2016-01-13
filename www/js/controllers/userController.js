// UserController
angular.module('samaritnApp.controllers').controller('UserController', ['$scope','$state','$cordovaGeolocation', '$http', 'PubNub', '$rootScope', function($scope, $state, $cordovaGeolocation, $http, PubNub, $rootScope) {
  
  $scope.showOptionsMenu = true;
  $scope.showMapDetails = false;
  var options = {timeout: 10000, enableHighAccuracy: true};

  // Pubnub 
  $scope.assistantChannel = "assis001";
  PubNub.init({
    publish_key:'pub-c-db340e13-fe69-4bcd-89e6-1664741a27bf',
    subscribe_key:'sub-c-a6b89cf6-ac10-11e5-b2c4-0619f8945a4f'
  });
  PubNub.ngSubscribe({channel: $scope.assistantChannel});
   $rootScope.$on(PubNub.ngMsgEv($scope.assistantChannel), function(event, payload) {
    console.log('Geo:', payload);
  })

  $scope.getNearbySam = function(){
    $http({method : 'GET', url : 'https://api.parse.com/1/classes/sams', headers: { 'X-Parse-Application-Id':'RlWUGepeHsAsAwvjmwI1fMBiIYd3sS4G4cm9dOiB', 'X-Parse-REST-API-Key':'lUkzbuew4Oe729uyQzRjkFtFKS3ofjaLr8OFga7O'}})
    .success(function(data, status) {
      $scope.allNearbySamaritnsResults = data.results;
      console.log($scope.allNearbySamaritnsResults);
    })
    .error(function(data, status) {
      console.log("Error");
    }).finally(function(){
      $scope.addNearByMarker();
      //$ionicLoading.hide();
    });
  }

  $scope.addNearByMarker = function(){
    var nearbySamLatLng = new google.maps.LatLng($scope.allNearbySamaritnsResults[0].location.latitude, $scope.allNearbySamaritnsResults[0].location.longitude);
    var distanceMatrixService = new google.maps.DistanceMatrixService();
        distanceMatrixService.getDistanceMatrix({
          origins: [nearbySamLatLng],
          destinations: [$scope.latLng],
          travelMode: google.maps.TravelMode.DRIVING,
          avoidHighways: false,
          avoidTolls: true
        }, function(response, status){
            $scope.traveldetails = response.rows[0].elements[0];
            $scope.showOptionsMenu = false;
            $scope.showMapDetails = true;
            $scope.$digest();
        });

    var nearbySamMarkerContentString = '<div>'+$scope.allNearbySamaritnsResults[0].name+'</div>';
    var nearbySamMarkerInfoWindow = new google.maps.InfoWindow({
      content: nearbySamMarkerContentString
    });
    var nearbySamMarker = new google.maps.Marker({
      position: nearbySamLatLng,
      map: $scope.map,
      icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|3a80e2|000000'
    });
    nearbySamMarkerInfoWindow.open($scope.map, nearbySamMarker);
    nearbySamMarker.addListener('click', function() {
      nearbySamMarkerInfoWindow.open($scope.map, nearbySamMarker);
    });


    var mapbounds = new google.maps.LatLngBounds();
    mapbounds.extend(nearbySamLatLng);
    mapbounds.extend($scope.latLng);
    $scope.map.fitBounds(mapbounds);
    $scope.map.panToBounds(mapbounds);
  }

  // $scope.calculateAndDisplayRoute = function(originLatLng, destinationLatLng) {
  //   $scope.showOptionsMenu = false;
  //   $scope.showMapDetails = true;
  //   var directionsService = new google.maps.DirectionsService;
  //   var directionsDisplay = new google.maps.DirectionsRenderer;
  //   directionsDisplay.setMap($scope.map);
  //   directionsDisplay.setOptions({suppressMarkers: true});
  //   directionsService.route({
  //     origin: originLatLng,
  //     destination: destinationLatLng,
  //     travelMode: google.maps.TravelMode.DRIVING
  //   }, function(response, status) {
  //     if (status === google.maps.DirectionsStatus.OK) {
  //       console.log(response);
  //       $scope.traveldetails = response.routes[0].legs[0];
  //       directionsDisplay.setDirections(response);
  //       $scope.showSteps(response);
  //     } else {
  //       window.alert('Directions request failed due to ' + status);
  //     }
  //   });
  // }

  // $scope.showSteps = function(directionResult) {
  //     $scope.$digest();
  //     var startMarker = new google.maps.Marker({
  //       position: directionResult.routes[0].legs[0].start_location,
  //       map: $scope.map
  //       //icon: "./img/Car-Marker.png"
  //     });
  //      var endMarker = new google.maps.Marker({
  //        position: directionResult.routes[0].legs[0].end_location,
  //        map: $scope.map
  //        //icon: "./img/camaro.png"
  //      });
  //  }

  /*
    $cordovaGeolocation.getCurrentPosition()
  */
   $cordovaGeolocation.getCurrentPosition(options).then(function(position){
     $scope.latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
     var mapOptions = {
       center: $scope.latLng,
       zoom: 15,
       mapTypeId: google.maps.MapTypeId.ROADMAP
     };
     $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      google.maps.event.addListenerOnce($scope.map, 'idle', function(){
          $scope.currentLocationMarker = new google.maps.Marker({
           position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
           map: $scope.map,
           icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|f7584c|000000',
           animation: google.maps.Animation.DROP
          });

      });
   }, function(error){
     console.log("Could not get location");
   });


  $scope.findNearestSam = function(){
    //$scope.currentLocationMarker.setMap(null);
    //$scope.calculateAndDisplayRoute($scope.latLng, new google.maps.LatLng(33.004181,-96.771684));
    $cordovaGeolocation.watchPosition({
        timeout : 3000,
        enableHighAccuracy: false
      }).then(null, function(err) {
        // error
      },
      function(position) {
        $scope.currentLocationMarker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        console.log("lat:" + position.coords.latitude +" and lng: "+ position.coords.longitude);
    });
  }

}]);