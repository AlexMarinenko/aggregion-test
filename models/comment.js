var mongoose = require('mongoose'),    
    Schema = mongoose.Schema,
    ObjectId = mongoose.Schema.Types.ObjectId;

var CommentSchema = new Schema({  
  userid: String,  
  txt: String,
  lft: Number,
  rgt: Number
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
