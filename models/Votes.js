var mongoose = require('mongoose')

var VoteSchema = new mongoose.Schema({
  title: String,
  selections: [{type: mongoose.Schema.Types.ObjectId, ref: 'Selection'}]  
})

mongoose.model('Vote', VoteSchema)