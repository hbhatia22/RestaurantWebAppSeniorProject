var mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    time: {type: Date, default: Date.now} ,
    customer: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    cart: {type: Object, required:true},
    table:{type:Number},
    cardNumber:{type:Number},
    cardName:{type:String},
    cardAddress:{type:String},
    cardApt:{type:String},
    cardState:{type:String},
    cardCvc:{type:Number},
    cardExpMonth:{type:Number},
    cardExpYear:{type:Number},
    comments:{type:Array},
    orderReady:{type:Boolean, default:0}

});

module.exports = mongoose.model("Order", orderSchema);