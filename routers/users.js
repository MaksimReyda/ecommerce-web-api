const User = require('../models/user')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const { route } = require('./products')
const jwt = require('jsonwebtoken')

//get the list of users
router.get('/', async (req, res) => {
    // .select('-passwordHash') - to not display password in responce
    const userList = await User.find().select('-passwordHash')

    if(!userList){
        res.status(500).json({
            success: false
        })
    }

    res.send(userList)
})

//get a specific  user
router.get('/:id', async (req, res) =>{

    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send({
            message: 'Invalid User Id',
            success: false
        })
    }
    
    const user = await User.findById(req.params.id).select('-passwordHash')

    if(!user){
        return res.status(500).send({
            message: 'The user with given ID was not found',
            success: false
        })
    }
    else{
        res.status(200).send({
            user: user,
            success: true
        })
    }


})

router.post('/', async (req, res) =>{
    let user = new User({
        name: req.body.name,

        email: req.body.email,

        passwordHash: bcrypt.hashSync(req.body.password, 10),

        phone: req.body.phone,

        isAdmin: req.body.isAdmin,

        street: req.body.street,

        apartment: req.body.apartment,

        zip: req.body.zip,

        city: req.body.city,

        country: req.body.country
    })

    user = await user.save()

    if(!user){
        return res.status(500).send({
            message: 'The user can not be created',
            success: false
        })
    }

    res.send(user)
})

router.post('/login', async (req, res) =>{
    //find the user by email
    const user = await User.findOne({
        email: req.body.email
    })

    const secret = process.env.secret

    if(!user){
        return res.status(400).send({
            message: 'The user was not found',
            success: false
        })
    }

    //compare given password by user with password from DB
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        //give the token for user

        const token = jwt.sign(
            {
                userId: user.id
            },
            secret,
            //expiration time for token (1 day)
            {expiresIn: '1d'}
        )
        
        res.status(200).send({
            message: 'The user authenticated',
            user: user,
            token: token,
            success: true
        })
    } else{
        res.status(400).send({
            message: 'The password is wrong',
            success: false
        })
    }   

})

module.exports = router