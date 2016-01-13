// AssistantController
angular.module('samaritnApp.controllers')
  .controller('AssistantController', ['$scope','$state','$cordovaGeolocation', '$http', 'PubNub', '$rootScope', function($scope, $state, $cordovaGeolocation, $http, PubNub, $rootScope) {
  
  // Pubnub 
  $scope.assistantChannel = "assis001";
  PubNub.init({
    publish_key:'pub-c-db340e13-fe69-4bcd-89e6-1664741a27bf',
    subscribe_key:'sub-c-a6b89cf6-ac10-11e5-b2c4-0619f8945a4f'
  });
  // PubNub.ngSubscribe({channel: $scope.assistantChannel});
  //  $rootScope.$on(PubNub.ngMsgEv($scope.assistantChannel), function(event, payload) {
  //   console.log('Geo:', payload);
  // })

  $scope.driverMode = false;
  // Get current location
   $cordovaGeolocation.getCurrentPosition({timeout: 10000, enableHighAccuracy: true}).then(function(position){
    $scope.assistantGeoData = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
     $scope.driverlatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
     var driverMapOptions = {
       center: $scope.driverlatLng,
       zoom: 15,
       mapTypeId: google.maps.MapTypeId.ROADMAP
     };
     $scope.driverMap = new google.maps.Map(document.getElementById("driverMap"), driverMapOptions);

      google.maps.event.addListenerOnce($scope.driverMap, 'idle', function(){
          $scope.currentLocationMarker = new google.maps.Marker({
           position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
           map: $scope.driverMap,
           icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|f7584c|000000',
           animation: google.maps.Animation.DROP
          });
      });
   }, function(error){
     console.log("Could not get location");
   });

  // setDriverMode()
   $scope.setDriverMode = function($event){
      $event.preventDefault();

      if (!$scope.driverMode){
        $scope.driverMode = true;
        
        var assistantWatchForGeoChagne = $cordovaGeolocation.watchPosition({timeout: 10000, enableHighAccuracy: true});
        assistantWatchForGeoChagne.then(null, function(err) {
          console.log(err);
        },
        function(position) {
           PubNub.ngPublish({
            channel: $scope.assistantChannel,
            message: {"assistantData": {_id: "assistantid", lat: position.coords.latitude, lng: position.coords.longitude}}
          });

          $scope.assistantGeoData.lat = position.coords.latitude;
          $scope.assistantGeoData.lng = position.coords.longitude;
          console.log(PubNub.ngListChannels());
        });
      } else {
        $scope.driverMode = false;
      }
   }


}]);