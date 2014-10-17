app.factory('Vote', ['$http', function($http) {
  var Vote = {}

  Vote.votes = [{title: 'Which sport?', 
             selections: [{selection_title:'Squash', points: 10},
                       {selection_title:'baseball', points: 0},
                       {selection_title:'Basketball', points: 1}
                      ]
                     },
             {title: 'Lunch Where?', 
             selections: [{selection_title:'Here', points: 1},
                       {selection_title:'Burger King', points: 0},
                       {selection_title:'East Side', points: 3},
                       {selection_title:'West Side', points: 0},
                       {selection_title:'Hearties', points: 2}
                       ]
                     }
            ]

  Vote.getAll = function() {
    return $http.get('/api/votes').success(function(data) {
      angular.copy(Vote.votes,data)
      // angular.copy allows for a copy from client side votes, making data the votes.votes still return value
    })
  }

  Vote.create = function(vote) {
    return $http.post('/api/votes', vote).success(function(data) {
      console.log('does this get caled?')
      return Vote.votes.push(data)
    })
  }

  return Vote
}])
