require('./database/database')
require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
const PORT = process.env.PORT || 5000

app
//TOKEN PARSER
.use(cookieParser())
.use(express.json())
//API ROUTES
.use('/auth', require('./routers/authRouter'))
.use('/user', require('./routers/userRouter'))
.use('/products', require('./routers/productRouter'))
.listen(PORT, () => console.log(`Server success port: ${PORT}`))