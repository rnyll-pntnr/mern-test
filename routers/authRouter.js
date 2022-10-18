const router = require('express').Router()
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            throw 'Complete all inputs to continue.'
        }

        if (password.length <= 7) {
            throw 'Password length must at least 8 characters.'
        }

        const existingUser = await User.findOne({ email })
        if (existingUser === null) {
            throw 'Wrong email or password.'
        }

        const comparePassword = await bcrypt.compare(password, existingUser.passwordHash)

        if (!comparePassword) {
            throw 'Wrong email or password.'
        }

        const accessToken = jwt.sign({
            user: existingUser._id
        }, process.env.ACCESS_TOKEN, {
            expiresIn: '3600s'
        })

        res.cookie('jwt-token', accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        .sendStatus(200)

    } catch (error) {
        res.sendStatus(401)
    }
})

router.get('/logout', (req, res) => {
    res.cookie('jwt-token', " ",{
        httpOnly: true,
        expires: new Date(0)
    }).sendStatus(200)
})


module.exports = router