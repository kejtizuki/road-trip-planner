map.controller('MapController', function($scope) {
  $scope.enableMap = true;

  $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

  $scope.route = {start: '', end: ''};

})
