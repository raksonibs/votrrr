var app = angular.module('votrrr', [
  'ui.router'
]);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
  // note needed to inject vote into the promise
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'partials/home',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['Vote', function(Vote){
          return Vote.getAll();
        }]
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
    .state('new_vote', {
      url: '/new_vote',
      templateUrl: 'partials/new_vote',
      controller: 'NewVotesCtrl'
    })

  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
})
