var mongoose = require('mongoose')

var VoteSchema = new mongoose.Schema({
  title: String,
  options: [{type: mongoose.Schema.Types.ObjectId, ref: 'Option'}]  
})

mongoose.model('Vote', VoteSchema)