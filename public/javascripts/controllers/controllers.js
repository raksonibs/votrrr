
app.controller('VoteCtrl', ['votes', '$scope', '$stateParams', function(votes, $scope, $stateParams) {
  $scope.vote = votes.votes[$stateParams.title]
}])

app.controller('VotesCtrl', function(Vote, $scope) {
  $scope.votes = Vote.votes

  $scope.upvote = function(selection) {
    selection.points += 1;
  }
})

app.controller('NewVotesCtrl', function(Vote, $scope) {
  $scope.votes = Vote.votes
  $scope.selections = []

  $scope.addVote = function() {
    if ( $scope.title === '' ) {
      return;
    } 

    Vote.create({
      title: $scope.title,
      selections: $scope.selections
    })

    $scope.title = ""
    $scope.selections = []
  }

  $scope.addOptionForm = function() {

    $scope.selections.push({
      selection_title: $scope.selection_title,
      points: 0
    })

    $scope.selection_title = ""
  }
  
})

app.controller('MainCtrl', function($scope, $location, Vote) {

  $scope.votes = Vote.votes

  console.log(Vote.votes.length)

  $scope.go = function( path ) {
    $location.path( path )
  }

});

