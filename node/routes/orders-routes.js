const express = require('express');

const ordersController = require('../controllers/orders-controller');
const protectRoutesMiddleware = require('../middlewares/auth/protect-routes-middleware');

const router = express.Router();

router.post('/webhook', ordersController.webhookHandler);

router.use(protectRoutesMiddleware);

router.get('/', ordersController.getOrders);

router.post('/', ordersController.addOrder);

router.get('/success', ordersController.getSuccess);

router.get('/failure', ordersController.getFailure);

module.exports = router;
