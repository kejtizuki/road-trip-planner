app.service('ProfileService', function($http) {
  this.getProfileData = function(token) {

    return $http({
      method: "POST",
      url: '/profile',
      headers: {
        'Content-Type': 'application/json'
      },
      //wysylane do backendu jako obiekt
      data: {token: token}
    })
    // .then(function(response) {
    //   console.log("RES: ", response);
    //   return response;
    // })
    // .catch(function() {
    //     console.log("NOT OK");
    // });
  }
})
