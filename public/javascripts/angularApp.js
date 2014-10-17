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
    });

  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);
})

app.factory('Vote', ['$http', function($http) {
  var Vote = {}

  Vote.votes = [{title: 'Which sport?', 
             options: [{option_title:'Squash', points: 10},
                       {option_title:'baseball', points: 0},
                       {option_title:'Basketball', points: 1}
                      ]
                     },
             {title: 'Lunch Where?', 
             options: [{option_title:'Here', points: 1},
                       {option_title:'Burger King', points: 0},
                       {option_title:'East Side', points: 3},
                       {option_title:'West Side', points: 0},
                       {option_title:'Hearties', points: 2}
                       ]
                     }
            ]

  Vote.getAll = function() {
    return $http.get('/api/votes').success(function(data) {
      angular.copy(Vote.votes,data)
      // angular.copy allows for a copy from client side votes, making data the votes.votes still return value
    })
  }

  return Vote
}])

app.factory('options', function() {
  var o = {
    options: []
  }

  return o
  //how to associate the two?return
})

app.controller('VoteCtrl', ['votes', '$scope', '$stateParams', function(votes, $scope, $stateParams) {
  $scope.vote = votes.votes[$stateParams.title]
}])

app.controller('VotesCtrl', ['votes', '$scope', function(votes, $scope) {
  $scope.votes = votes.votes

  $scope.upvote = function(option) {
    option.points += 1;
  }
}])

app.controller('NewVoteCtrl', ['votes', '$scope', function(votes, $scope) {
  $scope.votes = votes.votes
  $scope.options = []

  $scope.addVote = function() {
    if ( $scope.title === '' ) {
      return;
    } 

    $scope.votes.push({
      title: $scope.title,
      options: $scope.options//have to worry about mutliple numbers
    })

    $scope.title = ""
    $scope.options = []
  }

  $scope.addOptionForm = function() {

    console.log($scope.options)

    $scope.options.push({
      option_title: $scope.option_title,
      points: 0
    })

    $scope.option_title = ""
  }
  
}])

app.controller('MainCtrl', function($scope, $location, Vote) {

  $scope.votes = Vote.votes
  console.log(Vote.votes)

  $scope.go = function( path ) {
    $location.path( path )
  }

});

