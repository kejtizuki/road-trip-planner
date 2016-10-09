map.controller('MapController', function($scope, $rootScope) {
  $scope.enableMap = true;
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;


  $rootScope.initMap = function() {
    console.log("function");
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 7,
      center: {lat: 41.85, lng: -87.65}
    });
    directionsDisplay.setMap(map);
  }

  $scope.route = {start: '', end: ''};

  function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
      origin: $scope.route.start.id,
      destination: $scope.route.end.id,
      travelMode: 'DRIVING'
    }, function(response, status) {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  $scope.submit = function() {
    calculateAndDisplayRoute(directionsService, directionsDisplay);
  }
})
