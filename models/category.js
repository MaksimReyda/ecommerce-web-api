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

// exports.Categoty = mongoose.model('Category', categoryScheema)

module.exports = mongoose.model('Category', categoryScheema)
