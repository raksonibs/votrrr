var express = require('express');
var mongoose = require('mongoose');
var Vote = mongoose.model('Vote');
var Selection = mongoose.model('Selection');
var api = express.Router();

module.exports = function(app){

  api.use(function(req,res, next) {
    var selections_arr = []
    var merged_arr = []

    Vote.find(function(err, votes) {
      if (err) return next(err)
      for (x in votes) {
        selections_arr.push(votes[x].selections)
      }

      req.selections = merged_arr.concat.apply(merged_arr, selections_arr)
      return next()
    })
  })

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
    res.json(req.selections)
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
    var selection_titles = req.body.selections
    var selectionIdArr = []
    var selections = {}

    for (x in selection_titles) {
      var selection = new Selection({
        selection_title: selection_titles[x]
      })
      selection.save(function(err, vote_selection) {
        if (err) console.log(err)
        selections[vote_selection.selection_title] = vote_selection
        selectionIdArr.push(vote_selection.id) 
      })
    }

    var vote = new Vote({
      title: req.body.title,
      selections: selectionIdArr
    })

    vote.save(function(err, vote) {
      if (err) { 
        return next(err);       
      } 
      res.json(vote);
    })
  });

  app.use('/api', api);
  // not found error for undefined API routes
  app.all('/api/*', function(req, res){
    res.status(status).end();
  });

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