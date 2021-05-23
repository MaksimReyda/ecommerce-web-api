const {Category} = require('../models/category')
const express = require('express')
const router = express.Router()


router.get('/', async (req, res) => {
    const categoriesList = await Category.find()

    if(!categoriesList){
        res.status(500).json({
            success: false
        })
    }

    res.send(categoriesList)
})

module.exports = router