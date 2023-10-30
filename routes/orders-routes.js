const express = require('express');

const ordersController = require('../controllers/orders-controller');

const router = express.Router();

router.get('/', ordersController.getOrders);

router.post('/', ordersController.addOrder);

router.get('/success/:id', ordersController.getSuccess);

router.get('/failure/:id', ordersController.getFailure);

module.exports = router;
