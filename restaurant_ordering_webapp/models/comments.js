var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    comment:[{
        type: String
    }],
    customer: {type:mongoose.Schema.Types.ObjectId, ref:'Customer', required:true}
   
    
    

});

module.exports= mongoose.model("comment", commentSchema);