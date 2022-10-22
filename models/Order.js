const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    orderFood: [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'OrderFood',
        required : true
    }],
    shippingAddress : {type : String, required : true},
    city : {type : String, required : true},
    country : {type : String, required : true},
    phone : {type : String, required : true},
    totalPrice : {type : Number},
    user : {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
    status : {type : String, required : true, default :'pending'},
    dateOrdered :{type : Date, default : Date.now}
})
module.exports = mongoose.model('Order', OrderSchema)