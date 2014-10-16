var mongoose = require('mongoose')

var OptionSchema = new mongoose.Schema({
  option_title: String,
  points: { type: Number, default: 0 },
  options: [{type: mongoose.Schema.Types.ObjectId, ref: 'Vote'}]  
})

// populate method useful to get all options associated to Vote

mongoose.model('Option', OptionSchema)