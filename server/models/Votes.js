var mongoose = require('mongoose')

var SelectionSchema = new mongoose.Schema({
  selection_title: String,
  points: { type: Number, default: 0 },
  vote: {type: mongoose.Schema.Types.ObjectId, ref: 'Vote'} 
})

// these reference each other via ref embedded document, populate to grab. Save tricky, but eitehr through promise or proper query

var VoteSchema = new mongoose.Schema({
  title: String,
  selections: [{type: mongoose.Schema.Types.ObjectId, ref: 'Selection'}]  
})

SelectionSchema.methods.upvote = function(cb) {
  this.points += 1;
  this.save(cb)
}

var UserSchema = new mongoose.Schema({
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

mongoose.model('User', UserSchema)

// populate method useful to get all Selections associated to Vote

mongoose.model('Selection', SelectionSchema)

mongoose.model('Vote', VoteSchema)