const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
require('dotenv').config()

const verifyToken = (req, res, next) => {
    const authToken = req.cookies['jwt-token'];

    // Auth guard
    if (!authToken) return res.sendStatus(401)

    // jwt comparison
    jwt.verify(
        authToken,
        process.env.ACCESS_TOKEN,
        (error, decoded) => {
            // invalid token
            if (error) return res.sendStatus(403)
            req.user = decoded.user
            updateLog(req.user)
            next()
        }
    )
}

async function updateLog(_id) {
    const updateLog = await User.findByIdAndUpdate({
        _id: _id
    }, {
        lastActivity: Date(0)
    })
}

module.exports = verifyToken