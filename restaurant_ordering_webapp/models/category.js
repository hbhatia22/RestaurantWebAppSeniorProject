var mongoose = require('mongoose');

var catSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type:String, required:true},
    categoryImage: {type:String},
    categoryProducts: [
        {
            type:mongoose.Schema.Types.ObjectId, 
            ref:"Product", 
            required:true
        }
    ]

});

module.exports=mongoose.model("Category", catSchema);