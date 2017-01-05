profile.controller('ProfileController', ['ProfileService', '$scope', '$rootScope', '$window',
function(ProfileService, $scope, $rootScope, $window) {
  var token = sessionStorage.userToken;
  console.log(token);

  //jesli uzytkownik nie jest zalogowany to logowanie
  if (token === undefined || token === null) {
    $window.location.href = "/#/login";
  }
  else {
    ProfileService.getProfileData(token).then(function(response) {
      $scope.user = response.data;
      console.log($scope.user);
      $scope.histories = $scope.user.history;
      console.log($scope.histories);
    });
  }
}])
