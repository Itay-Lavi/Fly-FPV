const express = require('express');

const adminOrderController = require('../controllers/admin/order');
const adminProdPickerController = require('../controllers/admin/product-picker');
const adminProductController = require('../controllers/admin/product');
const imageUploadMiddleware = require('../middlewares/image-upload-middleware');

const router = express.Router();

router.get('/products', adminProductController.getProducts); // /admin/products

router.get('/products/new', adminProductController.getNewProduct);

router.post('/products', imageUploadMiddleware, adminProductController.createNewProduct);

router.get('/products/slider', adminProdPickerController.getSliderProducts);

router.route('/products/:id/slider')
.post(adminProdPickerController.handleSlider)
.delete(adminProdPickerController.handleSlider);

router.get('/products/:id/complementary', adminProdPickerController.getComplementaries);

router.route('/products/:id/complementary')
.post(adminProdPickerController.handleComplementary)
.delete(adminProdPickerController.handleComplementary);

router.get('/products/:id', adminProductController.getUpdateProduct);

router.post('/products/:id', imageUploadMiddleware, adminProductController.updateProduct);

router.delete('/products/:id', adminProductController.deleteProduct);

router.get('/orders', adminOrderController.getOrders);

router.patch('/orders/:id', adminOrderController.updateOrder);

module.exports = router;