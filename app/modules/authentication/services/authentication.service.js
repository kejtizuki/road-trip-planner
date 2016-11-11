app.service('AuthenticationService', function($http) {
  this.login = function(data) {
    $http.post('/login', data)
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  }
})
