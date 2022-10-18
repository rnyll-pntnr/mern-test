const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    lastActivity: {
        type: Date,
        required: true,
        default: Date.now
    },
})

userSchema.virtual('products', {
    ref: 'product',
    localField: '_id',
    foreignField: 'user_id'
})

userSchema.methods.toJSON = function () {
    const user = this.toObject()
    delete user.passwordHash
    delete user.__v
    return user
}

const User = mongoose.model('user', userSchema)

module.exports = User