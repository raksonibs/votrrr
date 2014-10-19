app.factory('Selection', ['$http', function($http) {

  var o = {}

  o.upvote = function(vote,selection) {
    return $http.get('/api/votes/'+vote._id+'/selections/'+selection._id+'/upvote').success(function(data) {
      selection.points += 1
    })
  }

  return o
}])