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
// router.get('/:id', async (req, res) =>{

//     if(!mongoose.isValidObjectId(req.params.id)){
//         res.status(400).send({
//             message: 'Invalid User Id',
//             success: false
//         })
//     }
    
//     const user = await User.findById(req.params.id).select('-passwordHash')

//     if(!user){
//         return res.status(500).send({
//             message: 'The user with given ID was not found',
//             success: false
//         })
//     }
//     else{
//         res.status(200).send({
//             user: user,
//             success: true
//         })
//     }
// })

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

router.put('/:id', async (req, res) =>{
    
    if(!mongoose.isValidObjectId(req.params.id)){
        return res.status(400).send({
            message: 'Invalid User Id',
            success: false
        })
    }
 
    // const user = await User.findById(req.params.id)
    // if(!user){
    //     return res.status(400).send({
    //         message: 'The user with given ID was not found',
    //         success: false
    //     })
    // }
    const userExist = await User.findById(req.params.id);

    let newPassword

    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.passwordHash;
    }
    

    const user = await User.findByIdAndUpdate(req.params.id, 
        {
            name: req.body.name,

            email: req.body.email,
    
            passwordHash: newPassword,
    
            phone: req.body.phone,
    
            isAdmin: req.body.isAdmin,
    
            street: req.body.street,
    
            apartment: req.body.apartment,
    
            zip: req.body.zip,
    
            city: req.body.city,
    
            country: req.body.country
        },
        //return new updated data
        { new: true }
    )
    if(!user){
        return res.status(500).send({
            message: 'The user with given ID can not be updated',
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
                userId: user.id,
                isAdmin: user.isAdmin
            },
            secret,
            //expiration time for token (1 day)
            {expiresIn: '1d'}
        )
        
        // res.status(200).send({
        //     message: 'The user authenticated',
        //     user: user,
        //     token: token,
        //     success: true
        // })
        return res.redirect(302, 'http://localhost:3000/api/users/profile')

        
        // res.redirect('/')
        // return res.redirect('pages/profile')
    } else{
        res.status(400).send({
            message: 'The password is wrong',
            success: false
        })
    }   

})

router.get('/login', (req, res) =>{
    res.render('users/login')
})


router.get('/profile', (req, res) =>{
    res.render('users/profile')
})


router.post('/register', async (req, res) =>{
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

router.get('/get/count', async (req, res) =>{

    const usertCount = await User.countDocuments( (count) => count)


    if(!usertCount){
        return res.status(500).send({
            // message: 'The product with given ID was not found',
            success: false
        })
    }
    else{
        res.status(200).send({
            usertCount: usertCount,
            success: true
        })
    }
})



router.delete('/:id', async (req, res) => {

    if(!mongoose.isValidObjectId(req.params.id)){
       return res.status(400).send({
           message: 'Invalid User Id',
           success: false
       })
    }

    const user = await User.findById(req.params.id)
    if(!user){
        return res.status(400).send({
            message: 'The user with given ID was not found',
            success: false
        })
    }

    User.findByIdAndDelete(req.params.id, (err, deletedUser) =>{

        if(err){
            return res.status(404).send({
                message: 'invalid user id',
                success: false,
                error: err
            })
        }
        else{
            res.status(200).send({
                message: 'The user is deleted',
                deletedUser: deletedUser,
                success: true
            })
        }
    })
})


module.exports = router