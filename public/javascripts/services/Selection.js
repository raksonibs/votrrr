app.factory('Selection', ['$http', function($http) {

  var o = {}

  o.upvote = function(vote,selection) {
    console.log(vote)
    console.log(selection)
    return $http.put('/api/votes/'+vote._id+'/selections/'+selection._id+'/upvote').success(function(data) {
      selection.points += 1
    })
  }

  return o
  //how to associate the two?return
}])