const mongoose = require('mongoose')

const OrderFoodSchema = new mongoose.Schema({
    quantity :{type : Number, required : true},
    Product :{type : mongoose.Schema.ObjectId, ref : 'Product'}
})

module.exports = mongoose.model('OrderFood', OrderFoodSchema)