var express = require('express');
var mongoose = require('mongoose');
var Vote = mongoose.model('Vote');
var Selection = mongoose.model('Selection');
var api = express.Router();
var q = require('q');
var deferred = require('deferred');

module.exports = function(app){

  // attach vote to req obj (req.vote)
  api.param('vote', function(req, res, next, id){
    var query = Vote.findById(id).populate('selections');
    query.exec(function(err, vote){
      if(err) return next(err);
      if(!vote) return next(new Error('cannot find vote'));
      req.vote = vote;
      return next();
    })
  });

  api.param('selection', function(req, res, next, id){
    var query = Selection.findById(id).populate('vote');
    query.exec(function(err, selection){
      if(err) return next(err);
      if(!selection) return next(new Error('cannot find that particular selection'));
      req.selection = selection;
      return next();
    })
  });

  api.get('/selections', function(req,res,next) {
    Selection.find({}, function(err, selections) {
      if (err) next(err)
      res.json(selections)
    })
  })

  api.get('/selections/:selection', function(req,res,next) {
    res.json(req.selection)
  })

  api.get('/selections/:selection/upvote', function(req, res, next){
    req.selection.points +=1
    req.selection.save(function(err, selection) {
      if (err) next(err)
      res.json(selection)
    })
  });
  // all votes
  api.get('/votes', function(req, res, next){
    Vote.find({}).populate('selections').exec(function(err, votes){
      if (err) return next(err);
      res.json(votes);
    });
  });

  api.get('/votes/:vote', function(req, res){
    res.json(req.vote);
  });

  api.get('/votes/:vote/selections', function(req, res){
    res.json(req.vote.selections);
  });


  api.get('/votes/:vote/selections/:selection', function(req, res, next){
    res.json(req.selection)
  });

  api.get('/votes/:vote/selections/:selection/upvote', function(req, res, next){
    req.selection.upvote(function(err, selection){
      if(err) return next(err);
      res.json(selection);
    })
  });

  api.post('/votes/:vote/selections', function(req, res, next){
    var selection = new Selection(req.body);
    selection.vote = req.vote;

    selection.save(function(err, selection){
      if (err) return next(err);
      req.vote.selections.push(selection);
      req.vote.save(function(err, vote){
        // vote updated
        if(err) return next(err);
        res.json(selection);
      });
    });
  });

  // create vote
  api.post('/votes', function(req, res, next) {
    var selectionIdArr = []
    var vote = new Vote({
      title: req.body.title,
      selections: selectionIdArr
    })
    // must be a better way to refactor this with promises

    q()
    .then(function() {
      var selection_titles = req.body.selections
      var selections = {}

      for (x in selection_titles) {
        var selection = new Selection({
          selection_title: selection_titles[x].selection_title,
          vote: vote._id
        })
        q.nfcall(selection.save(function(err, vote_selection) {
            if (err) console.log(err)
            selections[vote_selection.selection_title] = vote_selection
            selectionIdArr.push(vote_selection._id) 
            if ( selectionIdArr.length === selection_titles.length ) {
              vote.selections = selectionIdArr
              vote.save(function(err, vote) {
                if (err) { 
                  return next(err);       
                } 
                return res.json(vote);
              })
            }
          })
        )
      }
    })

  });

  app.use('/api', api);

  app.use(function(req, res, next) {
    if (req.user) {
      User.findById(req.user, function(error, user) {
        res.locals.user = user;
        next();
      });
    } else {
      next();
    }
  })

  // not found error for undefined API routes
  app.all('/api/*', function(req, res){
    res.status(status).end();
  });

  app.get('/login', function(req, res) {
    res.render('login');
  });

  app.post('/sendtoken',
    function(req, res, next) {
        // TODO: Input validation
      },
    // Turn the email address into a user ID
    passwordless.requestToken(
      function(user, delivery, callback) {
            // E.g. if you have a User model:
            User.findUser(email, function(error, user) {
              if(error) {
                callback(error.toString());
              } else if(user) {
                    // return the user ID to Passwordless
                    callback(null, user.id);
                  } else {
                    // If the user couldn’t be found: Create it!
                    // You can also implement a dedicated route
                    // to e.g. capture more user details
                    User.createUser(email, '', '',
                      function(error, user) {
                        if(error) {
                          callback(error.toString());
                        } else {
                          callback(null, user.id);
                        }
                      })
                  }
                })
          }),
    function(req, res) {
        // Success! Tell your users that their token is on its way
        res.render('sent');
      }
    );

  //server side route for the angularjs partials
  app.get('/partials/:name', function(req, res){
    // http://expressjs.com/api#router
    // mergeParams Ensure the req.params values from the parent router are preserved. If the parent and the child have conflicting param names, the child's value take precedence. Defaults to false.
    res.render('partials/' + req.params.name);
  });

  // everything else handled by this route
  app.get('*', function(req, res){
    res.render('index');
  });

};