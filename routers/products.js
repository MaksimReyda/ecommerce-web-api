
const express = require('express')

const Product = require('../models/product')
const Categoty = require('../models/category')

const router = express.Router()
const mongoose = require('mongoose')

router.get( `/`, async (req, res) =>{
    //to display some specific properties we can use await Product.find().select('name image)
    const productList = await Product.find().populate('category')

    if(!productList){
        res.status(500).json({
            success:false
        })
    }
    res.send(productList)
})

router.get('/:id', async (req, res) =>{
    // const product = await Product.findById(req.params.id)
    //to display some specific properties we can use await Product.find().select('name image)
    const product = await Product.findById(req.params.id).populate('category')


    if(!product){
        return res.status(500).send({
            message: 'The product with given ID was not found',
            success: false
        })
    }
    else{
        res.status(200).send({
            product: product,
            success: true
        })
    }
})

router.post( `/`,  async (req, res) =>{

    const category = await Categoty.findById(req.body.category)
    if(!category){
        return res.status(400).send('Invalid category')
    }

    let product = new Product({
        name: req.body.name,

        description: req.body.description,

        richDescription: req.body.richDescription,

        image: req.body.image,

        brand: req.body.brand,

        price: req.body.price,

        category: req.body.category,

        countInStock: req.body.countInStock,

        rating: req.body.rating,

        numReviews: req.body.numReviews,

        isFeatured: req.body.isFeatured
    })

    
    product = await product.save()
    
    if(!product){
        return res.status(500).send('The product can not be created')
    }

    res.send(product)


})

router.put('/:id', async (req, res) =>{

    //check the id 
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid Product Id')
    }

    const category = await Categoty.findById(req.body.category)
    if(!category){
        return res.status(400).send('Invalid category')
    }

    const product = await Product.findByIdAndUpdate(req.params.id, 
        {
            name: req.body.name,

            description: req.body.description,
    
            richDescription: req.body.richDescription,
    
            image: req.body.image,
    
            brand: req.body.brand,
    
            price: req.body.price,
    
            category: req.body.category,
    
            countInStock: req.body.countInStock,
    
            rating: req.body.rating,
    
            numReviews: req.body.numReviews,
    
            isFeatured: req.body.isFeatured
        },
        //return new updated data
        { new: true }
    )
    if(!product){
        return res.status(500).send({
            message: 'The product with given ID can not be updated',
            success: false
        })
    }  
    
    res.send(product)
})

router.delete('/:id', async (req, res) => {

    if(!mongoose.isValidObjectId(req.params.id)){
       return res.status(400).send('Invalid Product Id')
    }

    const product = await Product.findById(req.params.id)
    if(!product){
        return res.status(400).send({
            message: 'The product with given ID was not found'
        })
    }

    Product.findByIdAndDelete(req.params.id, (err, deletedProduct) =>{
        // const product = await Product.findById(req.params.id)
        // if(!product){
        //     return res.status(400).send('the product not found')
        // }

        if(err){
            return res.status(404).send({
                message: 'invalid product id',
                success: false,
                error: err
            })
        }
        else{
            res.status(200).send({
                message: 'the product is deleted',
                deletedProduct: deletedProduct,
                success: true
            })
        }
    })
})

router.get('/get/count', async (req, res) =>{

    const productCount = await Product.countDocuments( (count) => count)


    if(!productCount){
        return res.status(500).send({
            // message: 'The product with given ID was not found',
            success: false
        })
    }
    else{
        res.status(200).send({
            productCount: productCount,
            success: true
        })
    }
})

// get all featured products
router.get('/get/featured', async (req, res) =>{

    const products = await Product.find({
        isFeatured: true
    })


    if(!products){
        return res.status(500).send({
            // message: 'The product with given ID was not found',
            success: false
        })
    }
    else{
        // res.status(200).send({
        //     productCount: productCount,
        //     success: true
        // })
        res.send(products)
    }
})

module.exports = router