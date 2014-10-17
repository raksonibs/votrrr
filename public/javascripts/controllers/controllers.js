
app.controller('VoteCtrl', ['votes', '$scope', '$stateParams', function(votes, $scope, $stateParams) {
  $scope.vote = votes.votes[$stateParams.title]
}])

app.controller('VotesCtrl', function(Vote, $scope) {
  $scope.votes = Vote.votes

  $scope.upvote = function(option) {
    option.points += 1;
  }
})

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

  $scope.go = function( path ) {
    $location.path( path )
  }

});

