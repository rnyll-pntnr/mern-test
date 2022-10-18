const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MDB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) return console.error(err)
    console.log('Connected to database')
})