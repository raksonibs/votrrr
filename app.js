var app = angular.module('votrrr', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl'
    })
    .state('vote', {
      url: '/voting/{title}',
      templateUrl: '/vote.html',
      controller: 'VoteCtrl'
    })
    .state('votes', {
      url: '/votes',
      templateUrl: '/votes.html',
      controller: 'VotesCtrl'
    })
    .state('new_vote', {
      url: '/new_vote',
      templateUrl: '/new_vote.html',
      controller: 'NewVoteCtrl'
    })

  $urlRouterProvider.otherwise('home')

  // $locationProvider.html5Mode(true)
}])

app.factory('votes', function() {
  var votes = {
    votes: [{title: 'Which sport?', 
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
  }

  return votes
})

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

app.controller('MainCtrl', ['votes','$scope', '$location', function(votes,$scope, $location) {

  $scope.go = function( path ) {
    $location.path( path )
  }

}]);