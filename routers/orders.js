const Order = require('../models/order')
const OrderItem = require('../models/order-item')
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()

router.get('/', async (req, res) => {
    const orderList = await Order.find().populate('user', 'name email').sort({'dateOrdered': -1})

    if(!orderList){
        res.status(500).json({
            success: false
        })
    }

    res.send(orderList)
})

router.get('/:id', async (req, res) => {

    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send({
            message: 'Invalid Order Id',
            success: false
        })
    }
    

    const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate({
        path: 'orderItems',
        // populate: 'product'
        populate: { 
            path: 'product', 
            populate: 'category'
        }
    })

    if(!order){
        res.status(500).json({
            message: 'The order with given ID was not found',
            success: false
        })
    }

    res.send(order)
})

router.post('/', async (req, res) =>{

    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save()

        return newOrderItem._id

    }))

    //resolve promise
    const orderItemsIdsResolved = await orderItemsIds


    let order = new Order({
        orderItems: orderItemsIdsResolved,

        shippingAddress1: req.body.shippingAddress1,

        shippingAddress2: req.body.shippingAddress2,

        city: req.body.city,

        zip: req.body.zip,

        country: req.body.country,

        phone: req.body.phone,

        status: req.body.status,

        totalPrice: req.body.totalPrice,

        user: req.body.user
    })

    order = await order.save()

    if(!order){
        return res.status(500).send({
            message: 'The order can not be created',
            success: false
        })
    }

    res.send(order)
})

router.put('/:id', async (req, res) =>{

    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send({
            message: 'Invalid Order Id',
            success: false
        })
    }

    const order = await Order.findByIdAndUpdate(req.params.id, 
        {
            status: req.body.status
        },
        //return new updated data
        { new: true }
    )
    if(!order){
        return res.status(500).send({
            message: 'The order with given ID can not be updated',
            success: false
        })
    }  
    
    res.send(order)
})



router.delete('/:id', async (req, res) =>{

    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send({
            message: 'Invalid Order Id',
            success: false
        })
    }
 
    const order = await Order.findById(req.params.id)
    if(!order){
         return res.status(404).send({
            message: 'The order with given ID was not found',
            success: false
        })
    }


    // const deletedCategoty = async 
    Order.findByIdAndDelete(req.params.id, async (err, deletedOrder) => {
        if(err){
            return res.status(404).send({
                message: 'order not found',
                success: false,
                error: err
            })
        }
        else{
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            res.status(200).send({
                message: 'the order is deleted',
                deletedOrder: deletedOrder,
                success: true
            })
        }
    })
})

module.exports = router