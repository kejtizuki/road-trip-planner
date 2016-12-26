register.controller('AuthenticationController', function($scope, $rootScope, AuthenticationService, RegistrationService, $window) {
  console.log("reg");

  if (sessionStorage.userToken)
    var token = sessionStorage.userToken;
    else token = "";

  $scope.user = {username: '', password: '', token: token};
  $scope.error_message = '';

  $scope.login = function(){
    //placeholder until authentication is implemented
    $scope.error_message = 'login request for ' + $scope.user.username;
    AuthenticationService.login($scope.user);
  };

  $scope.register = function(){
    //placeholder until authentication is implemented
    $scope.error_message = 'registeration request for ' + $scope.user.username;
    RegistrationService.register($scope.user);
  };

  updateUserScope($rootScope);
});
