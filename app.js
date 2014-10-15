var app = angular.module('votrrr', []);
app.controller('MainCtrl', ['$scope', function($scope) {
  $scope.test = 'Hello world!';

  //vote has title, creator, opetions, and each option has votes, and title

  // test file multiple vote topics with multiple options

  $scope.vote = {title: 'Lunch Where?', options: [{option_title:'Here', points: 1},{option_title:'Burger King', points: 0},{option_title:'East Side', points: 3},{option_title:'West Side', points: 0},{option_title:'Hearties', points: 2}]}

  $scope.addVote = function() {
    if ( $scope.title === '' ) {
      return;
    } 

    $scope.votes.push({
      title: $scope.title,
      options: $scope.options //have to worry about mutliple numbers

    })
  }

  $scope.addOption = function() {
    $scope.vote.options.push({
      option_title: $scope.option_title,
      points: 0
    })

    $scope.option_title = '';
    $scope.points= 0;
  }

  $scope.upvote = function(option) {
    option.points += 1;
  }
}]);