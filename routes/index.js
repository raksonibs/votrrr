var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')
var Vote = mongoose.model('Vote')
var Selections = mongoose.model('Selection')

/* GET home page. */
router.get('/votes', function(req, res) {
  Vote.find(function(err, votes) {
    if (err) { return next(err) }
    res.json(votes)
  })
});

module.exports = router;
