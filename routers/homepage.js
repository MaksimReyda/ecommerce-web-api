const express = require('express')
const router = express.Router()
const request = require('request')


router.get('/', (req, res) => {
    
    let url = 'http://localhost:3000/api/products'
    request(url, (err, response, body)=>{
        if(err){
            console.log(err)
        } else{
            let data = JSON.parse(body)

            console.log(data)

            res.render('index',{
                productList: data                
            })
        }
    })


    // res.render('index')
})

module.exports = router