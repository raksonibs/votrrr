
app.controller('VoteCtrl', ['Vote', '$scope', '$stateParams', function(Vote, $scope, $stateParams) {
  $scope.vote = Vote.votes[$stateParams.title]
  $scope.footer = true;
}])

app.controller('VotesCtrl', ['Vote','Selection','$scope', 'socket', function(Vote, Selection, $scope, socket) {
  $scope.votes = Vote.votes
  $scope.footer = true;

  socket.on('casted:vote', function(selection) {
    // ugly needs to change. udnerscore method
    for (x in $scope.votes ) {
      for (y in $scope.votes[x].selections) {
        if ($scope.votes[x].selections[y].selection_title === selection.selection.selection_title) {
          $scope.votes[x].selections[y].points += 1;
        }
      }
    }
  })

  castVote = function(selection) {
    socket.emit('cast:vote', {
      selection: selection
    })
  }

  $scope.upvote = function(vote,selection) {
    Selection.upvote(vote,selection)
    castVote(selection)
  }
}])

app.controller('NewVotesCtrl', function(Vote, $scope) {
  $scope.votes = Vote.votes
  $scope.selections = []
  $scope.footer = true;

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

app.controller('MainCtrl', function($scope, $location, Vote, socket) {
  $scope.votes = Vote.getAll()

  $scope.footer = false;

  $scope.go = function( path ) {
    $location.path( path )
  }

});

