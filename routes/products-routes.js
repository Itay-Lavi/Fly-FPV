const express = require('express');

const productController = require('../controllers/product-controller');

const router = express.Router();

router.get('/products/:category', productController.getProductsByCategory);

router.get('/product-details/:id', productController.getProductDetails);

module.exports = router;