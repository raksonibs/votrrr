var express = require('express');
var mongoose = require('mongoose');
var Vote = mongoose.model('Vote');
var Selection = mongoose.model('Selection');
var api = express.Router();

module.exports = function(app){

  // attach vote to req obj (req.vote)
  api.param('vote', function(req, res, next, id){
    var query = Vote.findById(id);
    query.exec(function(err, vote){
      if(err) return next(err);
      if(!vote) return next(new Error('cannot find vote'));
      req.vote = vote;
      return next();
    })
  });

  api.param('selection', function(req, res, next, id){
//localhost:3000/api/votes/5441ef3d1c5cc21fbe6a20d7/selections/5441ef3d1c5cc21fbe6a20dd
    var id = mongoose.Types.ObjectId(id)
    Selection.findOne({"_id": id}, function(err, selection){
      if(err) return next(err);
      if(!selection) return next(new Error('cannot find selection'));
      req.selection = selection;
      return next();
    })
  });

  api.get('/selections', function(req,res,next) {
    Selection.find(function(err, selections) {
      if (err) next(err)
      res.json(selections)
    })
  })

  api.get('/selections/:selection', function(req,res,next) {
    //http://localhost:3000/api/selections/5441ef3d1c5cc21fbe6a20dc
    // this route still not operating as normal. not sure why? Will use vote/selections/selection instead
    res.json(req.selection)
  })

  api.get('/votes/:vote', function(req, res){
    req.vote.populate('selections', function(err, vote){
      res.json(vote);
    })
  });

  api.get('/votes/:vote/selections', function(req, res){
    req.vote.populate('selections', function(err, vote){
      res.json(vote.selections);
    })
  });

  // all votes
  api.get('/votes', function(req, res, next){
    Vote.find(function(err, votes){
      if (err) return next(err);
      res.json(votes);
    });
  });

  // create vote
  api.post('/votes', function(req, res, next) {
    var vote = new Vote(req.body); 

    for (x in req.body.selections) {
      var selection = new Selection(req.body.selections[x])

      selection.save(function(err,selection){})
    }

    vote.save(function(err, vote) {
      if (err) { 
        return next(err);       
      } 
      res.json(vote);
    })
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
    var comment = new Selection(req.body);
    comment.vote = req.vote;

    comment.save(function(err, comment){
      if (err) return next(err);
      req.vote.selections.push(comment);
      req.vote.save(function(err, vote){
        // vote updated
        if(err) return next(err);
        res.json(comment);
      });
    });
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