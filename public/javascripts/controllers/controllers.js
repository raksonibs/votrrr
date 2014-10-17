
app.controller('VoteCtrl', ['votes', '$scope', '$stateParams', function(votes, $scope, $stateParams) {
  $scope.vote = votes.votes[$stateParams.title]
}])

app.controller('VotesCtrl', ['Vote','Selection','$scope', function(Vote, Selection, $scope) {
  $scope.votes = Vote.votes

  $scope.upvote = function(vote,selection) {
    console.log('test')
    Selection.upvote(vote,selection)
  }
}])

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

  $scope.addSelectionForm = function() {

    $scope.selections.push({
      selection_title: $scope.selection_title,
      points: 0
    })

    $scope.selection_title = ""
  }
  
})

app.controller('MainCtrl', function($scope, $location, Vote) {
  $scope.votes = Vote.getAll()

  $scope.go = function( path ) {
    $location.path( path )
  }

});

