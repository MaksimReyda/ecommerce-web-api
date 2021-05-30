// const {Category} = require('../models/category')
const Category = require('../models/category')
const express = require('express')
const category = require('../models/category')
// const { route } = require('./products')
const router = express.Router()


router.get('/', async (req, res) => {
    const categoriesList = await Category.find()

    if(!categoriesList){
        res.status(500).json({
            success: false
        })
    }

    res.status(200).send(categoriesList)
})

router.get('/:id', async (req, res) =>{
    const category = await Category.findById(req.params.id)

    if(!category){
        return res.status(500).send({
            message: 'The categoty with given ID was not found',
            success: false
        })
    }
    else{
        return res.status(200).send({
            category: category,
            success: true
        })
    }
})

router.put('/:id', async (req, res) =>{
    const category = await Category.findByIdAndUpdate(req.params.id, 
        {
            name: req.body.name,
            icon: req.body.icon,
            color: req.body.color
        },
        //return new updated data
        { new: true }
    )
    if(!category){
        return res.status(500).send({
            message: 'The categoty with given ID can not be updated',
            success: false
        })
    }  
    
    res.send(category)
})

// add category
router.post('/', async (req, res) => {
    //creating new category model
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    })
    
    //creaing category
    category = await category.save()

    if(!category){
        return res.status(404).send('the category can not be created')
    }

    res.send(category)

    // const category = new Category({
    //     name: req.body.name,
    //     icon: req.body.icon,
    //     color: req.body.color
    // })

    // try{
    //     const newCategory = await category.save()
    //     res.send(newCategory)
    // } catch(err){
    //     // return res.status(404).send({
    //     //     message: 'the category can not be created',
    //     //     err: err
    //     // })
    //     console.log(err)
    //     return res.status(404).send(err)
    // }
})

router.delete('/:id', (req, res) =>{
    // const deletedCategoty = async 
    Category.findByIdAndDelete(req.params.id, (err, deletedCategoty) => {
        if(err){
            return res.status(404).send({
                message: 'category not found',
                success: false,
                error: err
            })
        }
        else{
            return res.status(200).send({
                message: 'the category is deleted',
                deletedCategoty: deletedCategoty,
                success: true
            })
        }
    })
})

module.exports = router