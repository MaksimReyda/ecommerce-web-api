const express = require('express')
const router = express.Router()
const request = require('request')


router.get('/signup', (req, res) => {
    res.render('signup')
})


router.get('/login', (req, res) => {
    res.render('login', {
        message: ''
    })
})


module.exports = router