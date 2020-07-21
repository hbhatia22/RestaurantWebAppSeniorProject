var mongoose = require('mongoose');

var tableSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    number:{type:Number, required:true},
   
    
    

});

module.exports= mongoose.model("table", tableSchema);