const router = require('express').Router()
const Products = require('../models/productModel')
const User = require('../models/userModel')
const verifyToken = require('../middleware/verifyToken')


router.get('/:id', verifyToken, async (req, res) => {
    try {
        const productList = await Products.findOne({
            _id: req.params.id,
            user_id: req.user
        })

        return res
        .status(200)
        .json({
            success: true,
            data: productList
        })

    } catch(error) {
        return res
        .sendStatus(400)
    }
    
})

router.get('/', verifyToken, async (req, res) => {
    try {
        const productList = await User.findById(req.user)
        await productList.populate('products')

        return res
        .status(200)
        .json({
            success: true,
            data: productList.products
        })

    } catch(error) {
        return res
        .sendStatus(400)
    }
    
})

router.post('/', verifyToken, async (req, res) => {
    try {
        const { product_name, product_description, product_price } = req.body

        //Validation
        if (!product_name || !product_description || !product_price) {
            throw 'Complete all inputs to continue.'
        }

        // Saving of products query
        const newProd = new Products({
            product_name,
            product_description,
            product_price,
            user_id: req.user,
        })

        const savedProd = await newProd.save()
        
        return res
        .sendStatus(201)
    } catch(error) {
        return res
        .sendStatus(400)
    }
})

router.delete('/', verifyToken, async (req, res) => {
    try {
        const { _id } = req.body

        if (!_id) {
            throw 'Eror'
        }
        const deleteProduct = await Products.deleteOne({ _id })

        return res
        .sendStatus(200)
    } catch (error) {
        return res
        .sendStatus(400)
    }
})

router.patch('/', verifyToken, async (req, res) => {
    try {
        const { _id, product_name, product_description, product_price } = req.body

        const toUpdate = await Products.findByIdAndUpdate({
            _id: _id
        },{
            product_name: product_name,
            product_description: product_description,
            product_price: product_price,
            
        })

        return res
        .sendStatus(200)
    } catch(error) {
        return res
        .sendStatus(400)
    }
})

module.exports = router