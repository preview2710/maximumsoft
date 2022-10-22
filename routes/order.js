const Order = require('../models/Order');
const Product = require('../models/Product')
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();

//CREATE
router.post('/', verifyToken, async (req, res) => {
    const orderFoods = req.body.orderFood.map(async orderFood =>{
        let newOrderFood = new orderFood({
            quantity : orderFood.quantity,
            product : orderFood.product
        })

        newOrderFood = await newOrderFood.save()

        return newOrderFood._id
    })
    const orderFoodsIdsResolved = await orderFoodIds

    const totalPrices = await Promise.all(orderFoodsIdsResolved.map(async (orderFoodsId=>{
        const orderFood = await orderFood.findById(orderFoodsId).populate('product','price')
        const totalPrice = orderFood.product.price * orderFood.quantity
        return totalPrice
    })))

    const totalPrice = totalPrices.reduce((a,b) => a+b, 0)

    const newOrder = new Order({
        orderFood: orderFoods,
        shippingAddress : req.body.shippingAddress,
        city : req.body.city,
        country : req.body.country,
        phone : req.body.phone,
        totalPrice : totalPrice,
        status : req.body.status,
        user : req.body.user
    })
    newOrder = await Order.save()

    if(!newOrder)
    return res.status(400).send('the order cannot be create')

    res.send(newOrder)
})


//DELETE
router.delete('/:id', verifyTokenAndAuthorization, (req, res) => {
    Order.findByIdAndRemove(req.params.id).than(order =>{
        if(order){
            return res.status(200).json({
                success : false,
                message : 'the order is delete'
            })
        }else{
            return res.status(404).json({
                success : false,
                message : 'order not found'
            })
        }    
    }).catch(err=>{
        return res.status(500).json({success : false, error : err})
    })

//GET ORDERS
router.get('/', verifyTokenAndAuthorization, async (req, res) => {
    const orderList = await Order.find().populate('user','username').sort({'dateOrdered' : -1})

    if(!orderList){
        res.status(500).json({success :false})
    }
    res.send(orderList)
})
// GET USER ORDER
router.get('/:id', verifyTokenAndAuthorization, async (req, res) => {
    const order = await Order.findById(req.params.id)
    .populate('user','username')
    .populate({path : 'orderFoods', populate : 'product'})

    if(!order){
        res.status(500).json({success :false})
    }
    res.send(order)
})
// PUT ORDER
router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
   const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
        status : req.body.status
    },
    { new : true}
   )
})

// GET TOTAL
router.get('/totalSales',async(req, res)=>{
    const totalSales = await Order.aggregate([
        { $group : {_id : null, totalsales : {$sum : '$totalPrice'}}}
    ])

    if(!totalSales){
        return res.status(400).send('The order sales cannot be generated')
    }

    res.send({totalsales : totalSales})
})

module.exports = router