var app = angular.module('votrrr', [
  'ui.router'
]);

// not working when put in its own service?
app.factory('socket', function($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

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
