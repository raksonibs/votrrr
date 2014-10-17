var app = angular.module('votrrr', [
  'ui.router'
]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){

  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'partials/home',
      controller: 'MainCtrl',
      resolve: {
        postPromise: function(Vote){
          return Vote.getAll();
        }
      }
    })
    .state('about', {
      url: '/about',
      templateUrl: 'partials/about'
    })
    .state('vote', {
      url: '/vote/{id}',  
      templateUrl: "partials/vote",
      controller: 'VoteCtrl'
    })
    .state('votes', {
      url: '/votes',
      templateUrl: 'partials/votes',
      controller: 'VotesCtrl'
    })

  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
})
