const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId;

const productSchema = new mongoose.Schema({
    user_id: {
        type: ObjectId,
        ref: "user"
    },
    product_name: {
        type: String,
        required: true
    },
    product_description: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_tag: {
        type: Array,
        required: false
    }
})

productSchema.pre('findOne', function (next) {
    this.populate('user_id')
    next();
});

productSchema.pre('find', function (next) {
    this.populate('user_id')
    next();
});


const Products = mongoose.model('product', productSchema)

module.exports = Products