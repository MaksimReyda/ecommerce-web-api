const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const authJwt = require('./helpers/jwt')

app.use(cors())
app.use('*', cors())


require('dotenv/config')


const api = process.env.API_URL

//Routers
const productsRouter = require('./routers/products')
const categoriesRouter = require('./routers/categories')
const usersRouter = require('./routers/users')
const ordersRouter = require('./routers/orders')

// Middleware
app.use(express.json())
app.use(morgan('tiny'))
app.use(authJwt())


app.use(`${api}/products`, productsRouter)
app.use(`${api}/categories`, categoriesRouter)
app.use(`${api}/users`, usersRouter)
app.use(`${api}/orders`, ordersRouter)



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