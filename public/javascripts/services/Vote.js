app.factory('Vote', ['$http', function($http) {
  var Vote = {}

  Vote.votes = [{title: 'Which sport?', 
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

  Vote.getAll = function() {
    return $http.get('/api/votes').success(function(data) {
      angular.copy(Vote.votes,data)
      // angular.copy allows for a copy from client side votes, making data the votes.votes still return value
    })
  }

  return Vote
}])
