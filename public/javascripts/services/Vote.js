app.factory('Vote', ['$http', function($http) {
  var Vote = {}

  Vote.votes = []

  Vote.getAll = function() {
    return $http.get('/api/votes').success(function(data) {
      angular.copy(data, Vote.votes)
      // angular.copy allows for a copy from client side votes, making data the votes.votes still return value
    })
  }

  Vote.create = function(vote) {
    return $http.post('/api/votes', vote).success(function(data) {
      Vote.votes.push(data)
    })
  }

  return Vote
}])
