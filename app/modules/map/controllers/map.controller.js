map.controller('MapController', function($scope) {
  $scope.enableMap = true;

  var styleArray = [
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#d3d3d3"
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "color": "#808080"
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#b3b3b3"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "weight": 1.8
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#d7d7d7"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ebebeb"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#a7a7a7"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#efefef"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#696969"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#737373"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#d6d6d6"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {},
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#dadada"
            }
        ]
    }
]

  $scope.map = {
    control: {},
    center: {
      latitude: 0,
      longitude: 0
    },
    zoom: 2,
  };

  $scope.options = {
     styles: styleArray
  };

  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  var geocoder = new google.maps.Geocoder();
  var routeboxer = new RouteBoxer();
  var distance = 0.5; // km


  // directions object -- with defaults
  $scope.directions = {
    showList: false
  }

  $scope.getDirections = function () {
    console.log($scope.directions);

    var request = {
      origin: $scope.directions.origin.formatted_address,
      destination: $scope.directions.destination.formatted_address,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    var reqFormatted = {
      origin: $scope.directions.origin.id,
      destination: $scope.directions.destination.id
    };

    directionsService.route(request, function (response, status) {

      console.log(response);

      // uiGmapIsReady.promise().then((function (maps) {
      //       $timeout($scope.setMap,"2000")}));

      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);

        var path = response.routes[0].overview_path;
        bounds = routeboxer.box(path, distance);

        searchBounds(bounds);

        directionsDisplay.setMap($scope.map.control.getGMap());
        // directionsDisplay.setPanel(document.getElementById('directionsList'));
        $scope.directions.showList = true;
      } else {
        alert('Google route unsuccesfull!');
      }
    });
  }

  function searchBounds(bound) {
    console.log("outer func");
    console.log(bound);
     for (var i = 0; i < bound; i++) {
       console.log(i);
       (function(i) {
         setTimeout(function() {

           // Perform search on the bound and save the result
           performSearch(bound[i]);

           //If the last box
           if ((bound.length - 1) === i) {
             addAllMarkers(bound);
           }
         }, 400 * i);
       }(i));
     }
   }

//  function addAllMarkers(place) {
//   var marker = new google.maps.Marker({
//     map: map,
//     position: place.geometry.location,
//     icon: {
//       url: 'http://maps.gstatic.com/mapfiles/circle.png',
//       anchor: new google.maps.Point(10, 10),
//       scaledSize: new google.maps.Size(10, 17)
//     }
//   });
// }


 function performSearch(bound) {
   console.log("perform");
   var request = {
     bounds: bound,
     keyword: 'bars'
   };

   currentBound = bound;
   service.radarSearch(request, callback);

   console.log(service.radarSearch(request, callback));

 }

 // Call back function from the radar search

 function callback(results, status) {
   console.log("callback func");
   if (status !== google.maps.places.PlacesServiceStatus.OK) {
     console.error(status);
     return;
   }

   for (var i = 0, result; result = results[i]; i++) {
     // Go through each result from the search and if the place exist already in our list of places then done push it in to the array
     if (!placeExists(result.id)) {
       allPlaces.push(result);
     }
   }
   console.log("all places");
   console.log(allPlaces);
 }

  // bound.contains(new google.maps.LatLng(allPlaces[j].geometry.location.lat(), allPlaces[j].geometry.location.lng()))

  $scope.route = {start: '', end: ''};

})
