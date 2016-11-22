map.controller('MapController', function($scope, uiGmapIsReady) {
  $scope.enableMap = true;

  $scope.map = {
    center: {
      latitude: 0,
      longitude: 0
    },
    disableDefaultUI: true,
    zoom: 2,
  };

  $scope.myCat = "";
  $scope.selectedBars = false;

  // console.log(document.getElementById('bars').checked);

  // $scope.categories = ['bars', 'museums'];


  var styleArray = [
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    },
    {
        "featureType": "administrative.country",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#000000"
            },
            {
                "lightness": 17
            }
        ]
    }
]

$scope.options = {
   styles: styleArray
};

  // var map = new google.maps.Map(document.getElementById('map'));

  $scope.mapControl = {};
  var mapControl;
  var service;

  uiGmapIsReady.promise().then((function (maps) {
    mapControl = $scope.mapControl.getGMap();
    service = new google.maps.places.PlacesService(mapControl);
  }));

  // var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();
  var geocoder = new google.maps.Geocoder();
  var routeboxer = new RouteBoxer();
  var distance = 0.1; // km

  directionsDisplay = new google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeColor: "#efefef"
    },
    suppressMarkers: true
  });

 var iconStart = {
   path: MAP_PIN,
   fillColor: '#d8d8d8',
   fillOpacity: 1,
   strokeColor: '',
   strokeWeight: 0,
   scale: 0.6,
   title: 'A'
 }

 var iconEnd = {
   path: MAP_PIN,
   fillColor: '#d8d8d8',
   fillOpacity: 1,
   strokeColor: '',
   strokeWeight: 0,
   scale: 0.6,
   title: 'B'
 }

  // directions object -- with defaults
  // $scope.directions = {
  //   showList: false
  // }

  $scope.getDirections = function () {
    console.log($scope.directions);

    if ($scope.selectedBars === true) {
      $scope.myCat = 'bars'
    }

    var request = {
      origin: $scope.directions.origin.formatted_address,
      destination: $scope.directions.destination.formatted_address,
      travelMode: google.maps.DirectionsTravelMode.WALKING
    };

    var reqFormatted = {
      origin: $scope.directions.origin,
      destination: $scope.directions.destination
    };

    function makeMarker(position, icon, title) {
      new Marker({
        position: position,
        map: mapControl,
        icon: icon,
        // map_icon_label: '<span class="map-icon map-icon-circle"></span>',
        title: title
      });
    }

    directionsService.route(request, function (response, status) {
      console.log("response");
      console.log(response);

      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);

        console.log("res loc");
        console.log(response.routes[0].legs[0].start_location);

        makeMarker( response.routes[0].legs[0].start_location, iconStart, "A" );
        makeMarker( response.routes[0].legs[0].end_location, iconEnd, 'B' );

        var path = response.routes[0].overview_path;
        bounds = routeboxer.box(path, distance);

        searchBounds(bounds, $scope.myCat);

        directionsDisplay.setMap($scope.mapControl.getGMap());
        // directionsDisplay.setPanel(document.getElementById('directionsList'));
        $scope.directions.showList = true;
      } else {
        alert('Google route unsuccesfull!');
      }
    });
  }

  function searchBounds(bound, category) {
    console.log("outer func");
    console.log(bound);
     for (var i = 0; i < bound.length; i++) {
       console.log(i);
       (function(i) {
         setTimeout(function() {

           // Perform search on the bound and save the result
           performSearch(bound[i], category);

           //If the last box
           if ((bound.length - 1) === i) {
            //  bound.forEach(addMarker);
           }
         }, 400 * i);
       }(i));
     }
   }

 function addMarker(place) {
  var marker = new Marker({
    map: mapControl,
    position: place.geometry.location,
    icon: {
      path: 'M 0, 0 m -10, 0 a 10, 10 0 1, 0 20, 0 a 10, 10 0 1, 0 -20, 0',
      fillColor: '#00CCBB',
      fillOpacity: 0.5,
      strokeColor: '',
      strokeWeight: 0,
      scale: 0.5
    }
  });
}


 function performSearch(bound, category) {
   console.log("perform");
   var request = {
     bounds: bound,
     keyword: category
   };


   currentBound = bound;
   service.radarSearch(request, callback);

   console.log(service.radarSearch(request, callback));

 }

 // Call back function from the radar search

 function callback(results, status) {
   console.log("callback func");
   console.log("nasze results");
   console.log(results);
   if (status !== google.maps.places.PlacesServiceStatus.OK) {
     console.error(status);
     return;
   }
   results.forEach(addMarker);

   for (var i = 0, result; result = results[i]; i++) {
     // Go through each result from the search and if the place exist already in our list of places then done push it in to the array
    //  if (!placeExists(result.id)) {
      //  allPlaces.push(result);
    //  }
   }
  //  console.log("all places");
  //  console.log(allPlaces);
 }

  // bound.contains(new google.maps.LatLng(allPlaces[j].geometry.location.lat(), allPlaces[j].geometry.location.lng()))

  $scope.route = {start: '', end: ''};

})
