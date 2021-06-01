const mongoose = require('mongoose')

const orderScheema = mongoose.Schema({

})

orderScheema.virtual('id').get(function () {
    return this._id.toHexString()
})

orderScheema.set('toJSON', {
    virtuals: true
})

exports.Order = mongoose.model('Order', orderScheema)