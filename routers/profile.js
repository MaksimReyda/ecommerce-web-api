const express = require('express')
const router = express.Router()
const request = require('request')

router.get('/profile/:id', (req, res) => {
    res.render('profile', {
        
    })
})

module.exports = router