const mongoose = require('mongoose')

const orderItemsScheema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
})  

orderItemsScheema.virtual('id').get(function () {
    return this._id.toHexString()
})

orderItemsScheema.set('toJSON', {
    virtuals: true
})

// exports.Order = mongoose.model('Order', orderScheema)
module.exports = mongoose.model('OrderItem', orderItemsScheema)