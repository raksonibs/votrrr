var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Vote = mongoose.model('Vote')
var Selections = mongoose.model('Selection')

router.param('vote', function(req,res,next,title) {
  // if (_id.match(/^[0-9a-fA-F]{24}$/)) {
  // var id = new mongoose.Schema.ObjectId(_id).path;
  var query = Vote.find({title: title})
  // }

  query.exec(function(err,vote) {
    if (err) { return next(err) }
    if (!vote) { return next(new Error("No vote by that id"))}

    req.vote = vote 
    return next()
  })
})

router.param('selection', function(req,res,next,option_title) {
  var query = Selection.find({title: title})
  // }

  query.exec(function(err,selection) {
    if (err) { return next(err) }
    if (!selection) { return next(new Error("No selection by that id"))}

    req.selection = selection 
    return next()
  })
})

router.get('/votes/:vote', function(req,res) {
  res.json(req.vote)
})

router.post('/votes/:vote/selections/:selection', function(req,res, next) {
  req.selection.upvote( function(err,selection) {
    if (err) { return next(err) }
    res.json(selection)
  })
})

/* GET home page. */
router.get('/votes', function(req, res, next) {
  Vote.find(function(err, votes) {
    if (err) { return next(err) }
    res.json(votes)
  })
});

//curl --data 'title=test' http://localhost:3000/votes


router.post('/votes', function(req,res, next) {
  var vote = new Vote(req.body)
  vote.save(function(err,vote) {
    if (err) { return next(err) }
    res.json(vote)
  })
})

module.exports = router;
