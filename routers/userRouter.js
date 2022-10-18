const router = require('express').Router()
const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/verifyToken')


router.get('/:id', verifyToken, async (req, res) => {
    const users = await User.findById(req.params.id)
    return res
    .status(200)
    .json({
        success: true,
        data: users
    })
})

router.get('/', verifyToken, async (req, res) => {
    const users = await User.find()
    return res
    .status(200)
    .json({
        success: true,
        data: users
    })
})

router.post('/', async (req, res) => {
    try {
        const { email, password, passwordVerify } = req.body

        if (!email || !password || !passwordVerify) {
            throw 'Complete all inputs to continue.'
        }

        if (password.length <= 7) {
            throw 'Password length must at least 8 characters.'
        }

        if (password !== passwordVerify) {
            throw 'Enter the same password twice to continue.'
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            throw 'Email address already taken.'
        }

        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        const newUser = new User({
            email,
            passwordHash
        })

        const savedUser = await newUser.save();

        const token = jwt.sign({
            user: savedUser._id
        }, process.env.ACCESS_TOKEN, {
            expiresIn: '3600s'
        })

        return res.cookie('jwt-token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        }).sendStatus(201)
    } catch (error) {
        return res.status(400).json({
            success : false,
            message: error.message ? error.message : error
        })
    }
})

router.delete('/', verifyToken, async (req, res) => {
    try {
        const { _id } = req.body

        if (!_id) {
            throw 'Error'
        }
        const deleteUser = await User.deleteOne({ _id })

        return res
        .sendStatus(200)
    } catch (error) {
        return res
        .sendStatus(403)
    }
})

router.patch('/', verifyToken, async (req, res) => {
    try {
        const { _id, email } = req.body

        const toUpdate = await User.findByIdAndUpdate({
            _id: _id
        },{
            email: email
        })

        return res
        .sendStatus(200)
    } catch(error) {
        return res
        .sendStatus(403)
    }
})


module.exports = router