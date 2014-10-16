var mongoose = require('mongoose')

var SelectionSchema = new mongoose.Schema({
  selection_title: String,
  points: { type: Number, default: 0 },
  votes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Vote'}]  
})

// populate method useful to get all Selections associated to Vote

mongoose.model('Selection', SelectionSchema)