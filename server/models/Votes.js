var mongoose = require('mongoose')

var SelectionSchema = new mongoose.Schema({
  selection_title: String,
  points: { type: Number, default: 0 },
  vote: {type: mongoose.Schema.Types.ObjectId, ref: 'Vote'}  
})

var VoteSchema = new mongoose.Schema({
  title: String,
  selections: [SelectionSchema]  
})

SelectionSchema.methods.upvote = function(cb) {
  this.points += 1;
  this.save(cb)
}

VoteSchema.methods.upvote = function(selection,cb) {
  for (x in this.selections) {
    if ( this.selections[x] === selection ) {
      this.selections[x].points += 1
      this.save
    }
  }
}

// populate method useful to get all Selections associated to Vote

mongoose.model('Selection', SelectionSchema)

mongoose.model('Vote', VoteSchema)