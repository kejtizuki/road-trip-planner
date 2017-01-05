map.service('MapService', function($http) {
  this.addToHistory = function(user, data, token) {
      $http({
        method: 'POST',
        url: '/history',
        header: {
          'Content-Type' : 'application/json'
        },
        data: {
          user: user,
          history: data,
          token: token
        }
      })
      .success(function(response) {
        var res = response;
        console.log("response ", res);
      })
      .error(function() {

      });
  }
})
