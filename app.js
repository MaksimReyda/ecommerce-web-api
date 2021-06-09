const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const authJwt = require('./helpers/jwt')
const errorHandler = require('./helpers/error-handler')
const expressLayouts = require('express-ejs-layouts')
const path = require('path')
const request = require('request')
const axios = require('axios')
app.use(cors())
app.use('*', cors())


require('dotenv/config')

const publicDirectory = path.join(__dirname, './public')

app.use(express.static(publicDirectory))

app.set("view engine", "ejs")
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)

const api = process.env.API_URL

// Middleware
app.use(express.json())
app.use(morgan('tiny'))
app.use(authJwt())
app.use(errorHandler)

//Routers
const productsRouter = require('./routers/products')
const categoriesRouter = require('./routers/categories')
const usersRouter = require('./routers/users')
const ordersRouter = require('./routers/orders')
const { emitKeypressEvents } = require('readline')
const category = require('./models/category')
const { response } = require('express')




app.use(`${api}/products`, productsRouter)
app.use(`${api}/categories`, categoriesRouter)
app.use(`${api}/users`, usersRouter)
app.use(`${api}/orders`, ordersRouter)



// app.use('/login', (req, res) =>{
//     res.render('pages/login')
// })

app.get('/', (req, res) =>{
    res.render('pages/profile')
})

app.post('/login', (req, res)=>{
    let url = 'http://localhost:3000/api/users/login'

    const options = {
        url: 'http://localhost:3000/api/users/login',
        
    }

    request.post(url, (err, response, body) =>{
        if(err){
            console.log(err)
        }else{

        }
    })
})

app.get('/products', (req, res) =>{

    let url = 'http://localhost:3000/api/products'
    request(url, (err, response, body)=>{
        if(err){
            console.log(err)
        } else{
            let data = JSON.parse(body)

            console.log(data)

            res.render('pages/products',{
                productList: data                
            })
        }
    })

    // async function makeRequest() {

    //     const config = {
    //         method: 'get',
    //         url: url
    //     }
    
    //     let result = await axios(config)
    
    //     console.log(result.data)
    
    //     // let data = JSON.parse(result)

    //     res.render('pages/products',{
    //         productList: result                
    //     })
    // }
    
    // makeRequest();

    // res.render('pages/products',{
    //     productList: result                
    // })


    // res.render('pages/products')
})


//Database
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then (() => {
        console.log('Connected to DB...')
    }).catch((err) => {
        console.log(err)
    })


//Server    
app.listen(3000, () => {
    console.log(api)
    console.log("Server is running on port 3000")
})