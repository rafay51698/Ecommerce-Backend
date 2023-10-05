const express = require('express');
const router = express.Router();

const { Product } = require('../models/product');
const { Category } = require('../models/category');

router.get('/', async (req, res) => {
    const products = await Product.find().populate('category')
    if (!products) {
        res.status(500).json({
            success: false
        })
    } else {
        res.send(products)
    }
});

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        res.status(4).json({
            success: false
        })
    } else {
        res.send(product)
    }
});

router.post('/', async (req, res) => {

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ success: false, message: 'Invalid Category', })

    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
    })
    product = await product.save();
    if (!product)
        return res.status(500).json({ message: "Product cannot be created" })
    res.send(product);
    // res.send(product);
});

router.put('/:id', async (req, res) => {

    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ success: false, message: 'Invalid Category', })

    const product = await Product.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            description: req.body.description,
            richDescription: req.body.richDescription,
            image: req.body.image,
            brand: req.body.brand,
            price: req.body.price,
            category: req.body.category,
            countInStock: req.body.countInStock,
            rating: req.body.rating,
            numReviews: req.body.numReviews,
            isFeatured: req.body.isFeatured,
        }, { new: true })
    if (!product)
        return res.status(400).json({ message: 'the product cannot be created' },),

            res.send(product);
});

router.delete('/:id', async (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ success: true, message: "Product is deleted" })
        } else {
            return res.status(404).json({ success: false, message: "Product not found" })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
});
module.exports = router;