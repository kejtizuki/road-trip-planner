profile.controller('ProfileController', function($scope, $rootScope, $window, ProfileService) {
  var token = sessionStorage.userToken;
  console.log(token);

  //jesli uzytkownik nie jest zalogowany to logowanie
  if (token === undefined || token === null) {
    $window.location.href = "/#/login";
  }
  else {
    ProfileService.getProfileData(token).then(function(response) {
      $scope.user = response;
      console.log($scope.user);
    });
  }
})
