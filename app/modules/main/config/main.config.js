main.config(function ($urlRouterProvider, $stateProvider) {
  // console.log('wchodze');
  // $stateProvider
  // .state('home', {
  //   url: '/',
  //   abstract: true,
  //   template: '</ui-view>',
  //   views: {
  //     'home': {
  //       template: "hello"
  //       // templateUrl: 'app/modules/main/views/main.view.html'
  //     },
  //     'filters@home': {
  //       templateUrl: 'app/modules/main/views/about.html',
  //       controller: ''
  //      },
  //     'tabledata@home': {
  //       templateUrl: 'app/modules/main/views/homr.html',
  //       controller: ''
  //     },
  //     'graph@home': {},
  //   }
  // })


  $urlRouterProvider.otherwise('/home');
  $stateProvider
  .state('home', {
    url: '/home',
    templateUrl: 'app/modules/main/views/homr.html'
  })
  .state('start', {
    url: '/start',
    templateUrl: 'app/modules/map/views/map.view.html',
    controller: 'MapController'
  })
  .state('about', {
    url: '/about',
    templateUrl: 'app/modules/main/views/about.html'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'app/modules/authentication/views/login.view.html',
    controller: 'AuthenticationController'
  })
  .state('logout', {
    url: '/logout',
      templateUrl: 'app/modules/authentication/views/logout.view.html',
      controller: 'AuthenticationController',
      resolve: {
        function(){
          if(sessionStorage.length > 0){
            sessionStorage.clear();
          }
        }
    }
  })
  .state('register', {
    url: '/register',
    templateUrl: 'app/modules/authentication/views/register.view.html',
    controller: 'AuthenticationController'
  })
  .state('profile', {
    url: '/profile',
    templateUrl: 'app/modules/profile/views/profile.view.html',
    controller: 'ProfileController'
  });




});


// app.config(function ($routeProvider) {
    // $routeProvider
    // .when('/',
    // {
    //     templateUrl: ,
    //     controller: 'HomeController'
    // })
    // .when('/about',
    // {
    //     templateUrl: 'app/modules/main/views/about.html',
    //     controller: 'AboutController'
    // })
    // .when('/contact',
    // {
    //     templateUrl: 'contact.html',
    //     controller: 'ContactController'
    // })
    // .when('/PD',
    // {
    //     templateUrl: '/SPA/PD/index.html',
    //     controller: "PDController"
    // })
    // .when('/PD/Create',
    // {
    //     templateUrl: '/SPA/PD/create.html',
    //     controller: "PDControllerCreate"
    // })
    // .when('/PD/Edit/:id',
    // {
    //     templateUrl: '/SPA/PD/edit.html',
    //     controller: "PDControllerEdit"
    // })
    // .when('/PD/Details/:id',
    // {
    //     templateUrl: '/SPA/PD/details.html',
    //     controller: "PDControllerDetails"
    // })
    // .when('/PD/Delete/:id',
    // {
    //     templateUrl: '/SPA/PD/delete.html',
    //     controller: "PDControllerDelete"
    // });
//
// });
