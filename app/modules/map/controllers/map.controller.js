map.controller('MapController', function($scope, uiGmapIsReady, $rootScope, filterFilter, MapService, ProfileService) {

  var token = sessionStorage.userToken;

  $scope.addToHistory = function() {
    // console.log("hist ", $scope.userHistory);
    // MapService.addToHistory($scope.userHistory);

    ProfileService.getProfileData(token).then(function(res) {
      var user = res.data;
      MapService.addToHistory(user, $scope.userHistory, token);
    });
  }

  $scope.enableMap = true;

  $scope.map = {
    center: {
      latitude: 0,
      longitude: 0
    },
    disableDefaultUI: true,
    zoom: 2,
  };

  $scope.selectedBars = false;
  $scope.selectedMuseums = false;

  $scope.categories = [
    { name: 'bars', selected: false },
    { name: 'museums', selected: false },
    { name: 'shops', selected: false}
  ];

  $scope.directions = {
    destination: {},
    origin: {}
  }

  $scope.userHistory = {
    directions: $scope.directions,
    categories: $scope.categories
  }

  $scope.selection = [];

  $scope.selectedCategories = function selectedCategories() {
    return filterFilter($scope.categories, { selected: true });
  };

  $scope.$watch('categories|filter:{selected:true}', function (nv) {
    $scope.selection = nv.map(function (category) {
      return category.name;
    });
  }, true);

  // console.log(document.getElementById('bars').checked);

  // $scope.categories = ['bars', 'museums'];

var styleArray = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e9e9e9"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
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
                "color": "#ffffff"
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
                "color": "#ffffff"
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
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#333333"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefefe"
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
                "color": "#fefefe"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
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
      strokeColor: "#544d4d"
    },
    suppressMarkers: true
  });

 var iconStart = {
   path: MAP_PIN,
   fillColor: '#544d4d',
   fillOpacity: 1,
   strokeColor: '',
   strokeWeight: 0,
   scale: 1,
   title: 'A'
 }

 var iconEnd = {
   path: MAP_PIN,
   fillColor: '#544d4d',
   fillOpacity: 1,
   strokeColor: '',
   strokeWeight: 0,
   scale: 1,
   title: 'B'
 }

 $scope.showHeartButton = false;

  $scope.getDirections = function () {

    if (angular.equals($scope.directions.origin, {}) && angular.equals($scope.directions.destination, {})) {
      $scope.errorEmpty = "U have to fill in origin and destination fields";
    }
    else if(angular.equals($scope.directions.origin, {}) && !angular.equals($scope.directions.destination, {})) {
      $scope.errorEmpty = "U have to fill in origin field";
    }
    else if(!angular.equals($scope.directions.origin, {}) && angular.equals($scope.directions.destination, {})) {
      $scope.errorEmpty = "U have to fill in destination field";
    }
    else {
      console.log($scope.directions);
      $scope.errorEmpty = "";
      $scope.showHeartButton = true;
      var request = {
        origin: $scope.directions.origin.formatted_address,
        destination: $scope.directions.destination.formatted_address,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
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
          map_icon_label: '<span class="map-icon map-icon-circle" id="mapIcon"></span>',
          title: title
        });
      }

      directionsService.route(request, function (response, status) {

        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);

          makeMarker( response.routes[0].legs[0].start_location, iconStart, "A" );
          makeMarker( response.routes[0].legs[0].end_location, iconEnd, 'B' );

          var path = response.routes[0].overview_path;
          bounds = routeboxer.box(path, distance);
          console.log("B ", bounds);
          console.log("path ", path);

          mapControl.addListener('bounds_changed', function() {
            // console.log(mapControl.getBounds().getNorthEast().lat(), mapControl.getBounds().getSouthWest().lat());
            searchBoundsWithinViewport(bounds, mapControl);
          });

          // searchBounds(bounds);

          directionsDisplay.setMap($scope.mapControl.getGMap());
          $scope.directions.showList = true;
        } else {
          alert('Google route unsuccesfull!');
        }
      });
    }

  }

  //zmienic distance w zaleznosci od dl trasy



  var boundsTimeoutsBuffer = []
  var boundsCache = []

 //  //funkcja sprawdzajaca co ktory bound ma byc przeszukany w zaleznosci od zoomu.
  function probabilityFilter (bounds, zoom) {
    var coeff = 16 - zoom < 1 ? 1 : 16 - zoom
    var counter = 0
    return bounds.filter(function () {
      counter++
      //reszta z dzielenia przez 2 -> co drugi bound, przez 3 to co trzeci itd
      return counter % coeff === 0
    })
  }

 // // sprawdzanie czy dany bound zostal juz przeszukany. Został przeszukany tzn ze został dodany do tablicy
 // // boundsCache
  function boundAlreadyCached (bound) {
    for(var i = 0; i < boundsCache.length; i++) {
      if (boundsCache[i].equals(bound)) {
        return true
      }
    }
    return false
  }

  function searchBoundsWithinViewport(bounds, viewport) {

    var viewportBounds = viewport.getBounds()
    var zoom = viewport.getZoom()
    console.log("zoom ", zoom);
    // filter przyjmuje funkcje ktora przyjmuje pojedynczy element z przeszukiwanej listy
    var boundsWithinViewport = bounds.filter(function (bound) {
      return bound.intersects(viewportBounds) && !boundAlreadyCached(bound)
    })
    boundsWithinViewport = probabilityFilter(boundsWithinViewport, zoom)
    //sprawdzac czy w danym zoomie przeszukal wszystkie boundsy, length===0 to wszystkie zosaly przeszukane
    //w viewporcie w ktorym jestem
    console.log(boundsWithinViewport.length);
    if (boundsWithinViewport.length === 0 ) {
      $scope.mapError = "Zoom in or move the map within the route";
    }
    boundsTimeoutsBuffer.forEach(clearTimeout)
     for (var i = 0; i < boundsWithinViewport.length; i++) {
       (function(i) {
        //  rezultaty timeoutow do tablicy
         boundsTimeoutsBuffer.push(setTimeout(function() {
           boundsCache.push(boundsWithinViewport[i])
          if ($scope.categories[0].selected === true) {
            performSearchBars(boundsWithinViewport[i]);
          }
          if ($scope.categories[1].selected === true) {
            performSearchMuseums(boundsWithinViewport[i]);
          }
          if ($scope.categories[2].selected === true) {
            performSearchShops(boundsWithinViewport[i]);
          }
        }, 1200 * i));
       }(i));
     }
   }

  // function searchBounds(bound) {
  //    for (var i = 0; i < bound.length; i++) {
  //      (function(i) {
  //        setTimeout(function() {
  //         if ($scope.categories[0].selected === true) {
  //           performSearchBars(bound[i]);
  //         }
  //         if ($scope.categories[1].selected === true) {
  //           performSearchMuseums(bound[i]);
  //         }
  //         if ($scope.categories[2].selected === true) {
  //           performSearchShops(bound[i]);
  //         }
  //        }, 1200 * i);
  //      }(i));
  //    }
  //  }


  var infowindow = new google.maps.InfoWindow();

  function addMarkers(place, color) {
    var marker = new Marker({
      map: mapControl,
      position: place.geometry.location,
      icon: {
        path: 'M 0, 0 m -10, 0 a 10, 10 0 1, 0 20, 0 a 10, 10 0 1, 0 -20, 0',
        fillColor: color,
        fillOpacity: 0.5,
        strokeColor: '',
        strokeWeight: 0,
        scale: 0.5
      }
    });
    google.maps.event.addListener(marker, 'click', function(e) {
       console.log(e);
      var geocoder = new google.maps.Geocoder;
      geocoder.geocode({'placeId': place.place_id}, function(results, status) {
        console.log(results[0]);
        infowindow.setContent('<div><h4>' + results[0].address_components[0].long_name + '</h4>'
        + results[0].formatted_address.substring(results[0].formatted_address.indexOf(",") + 1) + '</div>');
      });
      infowindow.open(map, this);
    });
  }

function callbackBars (results, status) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    console.error(status);
    return;
  }
  //  results.forEach(addMarkerBars);
  for (var i = 0; i < results.length; i++) {
    addMarkers(results[i], "#00CCBB");
  }
}

function callbackMuseums (results, status) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    console.error(status);
    return;
  }
  //  results.forEach(addMarkerMuseums);
  for (var i = 0; i < results.length; i++) {
    addMarkers(results[i], "yellow");
  }
}

function callbackShops (results, status) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    console.error(status);
    return;
  }
  //  results.forEach(addMarkerMuseums);
  for (var i = 0; i < results.length; i++) {
    addMarkers(results[i], "#f47e69");
  }
}

 function performSearchBars(bound) {
   console.log("bars");
   var request = {
     bounds: bound,
     keyword: "bars"
   };

   currentBound = bound;
   service.radarSearch(request, callbackBars);
   return true;
 }

 function performSearchMuseums(bound) {
   console.log("museums");
   var request = {
     bounds: bound,
     keyword: "museums"
   };

   currentBound = bound;
   service.radarSearch(request, callbackMuseums);
   return true;
}

function performSearchShops(bound) {
  console.log("shops");
  var request = {
    bounds: bound,
    keyword: "shops"
  };

  currentBound = bound;
  service.radarSearch(request, callbackShops);
  return true;
}

})
