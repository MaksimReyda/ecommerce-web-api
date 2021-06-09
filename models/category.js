const mongoose = require('mongoose')

const categoryScheema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    color: {
        type: String
    }
})

categoryScheema.virtual('id').get(function () {
    return this._id.toHexString()
})

categoryScheema.set('toJSON', {
    virtuals: true
})


module.exports = mongoose.model('Category', categoryScheema)
