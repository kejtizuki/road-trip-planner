app.service('AuthenticationService', function($http, $rootScope, $window) {
  this.login = function(data) {
    $http({
      method: 'POST',
      url: '/login',
      header: {
        'Content-Type' : 'application/json'
      },
      data: data
    })
    .success(function(response) {
      var res = response;
      sessionStorage.userToken = res;
      console.log("res ", res);
      updateUserScope($rootScope);
      $window.location.href = '/#/profile';
    })
    .error(function() {

    });
  }

  this.logout = function() {

  }
})

app.service('RegistrationService', function($http, $rootScope, $window) {
  this.register = function(data) {
    $http({
      method: 'POST',
      url: '/register',
      header: {
        'Content-Type' : 'application/json'
      },
      data: data
    })
    .success(function(response) {
      var res = response;
      sessionStorage.userToken = res.token;
      console.log(res);
      updateUserScope($rootScope);
      $window.location.href = '/#/profile';
    })
    .error(function() {

    });
  }
})
