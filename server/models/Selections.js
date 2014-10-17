var mongoose = require('mongoose')

var SelectionSchema = new mongoose.Schema({
  selection_title: String,
  points: { type: Number, default: 0 },
  votes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Vote'}]  
})

SelectionSchema.methods.upvote = function(cb) {
  this.points += 1;
  this.save(cb)
}

// populate method useful to get all Selections associated to Vote

mongoose.model('Selection', SelectionSchema)