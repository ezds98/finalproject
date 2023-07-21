require('dotenv').config()
require('./helpers/database')
const bodyParser = require('body-parser');
const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
const authRoute = require('./routes/auth.routes')
const subCategoryRoute = require('./routes/sub_category.routes')
const CategoryRoute = require('./routes/category.routes')
const authorRoute = require('./routes/author.routes')
const commentRoute = require('./routes/comment.routes')
const productRoute = require('./routes/product.routes')
const uploadRoute = require('./routes/upload.routes')
const userRoute = require('./routes/users.routes')
const customerRoute = require('./routes/customer.routes')
const salesRoute = require('./routes/sales.routes')

const { verifyAccessToken } = require('./helpers/jwtHelper')

const app = express()
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: "5mb" ,extended: true, parameterLimit: 50000 }));

const cors = require('cors')
app.use(cors({origin:"*"}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

const PORT = process.env.PORT || 3000

app.get('/', verifyAccessToken, async (req, res) => {
    res.send("Welcome Welcome!")
})

// all the routes initialization
app.use('/auth', authRoute)
app.use('/',subCategoryRoute)
app.use('/',CategoryRoute)
app.use('/',authorRoute)
app.use('/',commentRoute)
app.use('/',productRoute)
app.use('/',uploadRoute)
app.use('/',userRoute)
app.use('/',customerRoute)
app.use('/', salesRoute)

app.use(async (req, res, next) => {
    next(createError.NotFound('This is not working '))
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    console.log('icon')
})