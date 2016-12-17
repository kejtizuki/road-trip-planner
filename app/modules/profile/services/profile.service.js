app.service('ProfileService', function($http) {
  this.getProfileData = function(token) {

    $http({
      method: "POST",
      url: '/profile',
      headers: {
        'Content-Type': 'application/json'
      },
      //wysylane do backendu jako obiekt
      data: {token: token}
    })
    .success(function(response) {
      console.log("RES: ", response);
      
    })
    .error(function() {
        console.log("NOT OK");
    });
  }
})
