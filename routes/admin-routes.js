const express = require('express');

const adminOrderController = require('../controllers/admin/order');
const adminProdSliderController = require('../controllers/admin/product-slider');
const adminProductController = require('../controllers/admin/product');
const imageUploadMiddleware = require('../middlewares/image-upload-middleware');

const router = express.Router();

router.get('/products', adminProductController.getProducts); // /admin/products

router.get('/products/new', adminProductController.getNewProduct);

router.post('/products', imageUploadMiddleware, adminProductController.createNewProduct);

router.get('/products/slider', adminProdSliderController.getSliderProducts);

router.post('/products/slider/:id', adminProdSliderController.addProductToSlider);

router.delete('/products/slider/:id', adminProdSliderController.removeProductFromSlider);

router.get('/products/:id', adminProductController.getUpdateProduct);

router.post('/products/:id', imageUploadMiddleware, adminProductController.updateProduct);

router.delete('/products/:id', adminProductController.deleteProduct);

router.get('/orders', adminOrderController.getOrders);

router.patch('/orders/:id', adminOrderController.updateOrder);

module.exports = router;