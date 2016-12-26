var app = angular.module('ngApp', ['ui.router', 'uiGmapgoogle-maps', 'google.places', 'ngMain', 'ngMap', 'ngProfile', 'ngAuthenticate']);

console.log('app');

app.run(['$rootScope', '$location', '$timeout', function ($rootScope, $location, $timeout) {
  $rootScope.userLoggedIn = false;

  $rootScope.$on('$stateChangeSuccess',stateChangeController);
	updateUserScope($rootScope);


}]);

stateChangeController.$inject = ['$rootScope', '$state', '$location'];
function stateChangeController($rootScope, $state, $location){
	// var currentPath = $state.name;
	// if((currentPath === "login" || currentPath === "register") && sessionStorage.auth_token !== "" && sessionStorage.auth_token !== undefined){
	// 	window.location.href = "index.html#/bank";
	// }else if(currentPath !== "login" && currentPath !== "register" && currentPath !== "home" && (sessionStorage.auth_token === "" || sessionStorage.auth_token === undefined)){
	// 	window.location.href = "index.html#/login";
	// }
}

function updateUserScope($rootScope) {
  if(sessionStorage.userToken !== "" && sessionStorage.userToken !== undefined) {
		$rootScope.userLoggedIn = true;
	}
  else {
		$rootScope.userLoggedIn = false;
	}
}
