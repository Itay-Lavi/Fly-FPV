const paypalWebhooks = require('../util/paypal/webhooks');
const paypalOrders = require('../util/paypal/orders');

const Order = require('../models/order-model');
const User = require('../models/user-model');

async function webhookHandler(req, res) {
  const webhookEvent = req.body;
  const headers = req.headers;

  const token = webhookEvent['resource']['id'];
  const payerId = webhookEvent['resource']['payer']['payer_id'];

  if (webhookEvent['event_type'] !== 'CHECKOUT.ORDER.APPROVED') {
    return;
  }

  const accessToken = await paypalOrders.getAccessToken();
  const verified = await paypalWebhooks.verifyWebhookSignature(
    accessToken,
    headers,
    webhookEvent
  );

  if (!verified) {
    return console.log(
      'Webhook signature verification failed, token: ' + token
    );
  }

  try {
    const order = await Order.findByToken(token);
    const orderStatus = order.paymentData.status;
    if (
      orderStatus === Order.statusOptions.paymentPending ||
      orderStatus === Order.statusOptions.unpaid
    ) {
      order.paymentData.status = Order.statusOptions.preparingForShipment;
      order.paymentData.payerId = payerId;
      await order.save();
    }
  } catch (e) {
    console.log(e);
  }

  res.status(200).send();
}

async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render('customer/orders/all-orders', {
      orders: orders,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  const accessToken = await paypalOrders.getAccessToken();

  let userData;
  try {
    userData = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const session = await paypalOrders.createOrder(accessToken, cart, userData);

  let orderId;
  try {
    const paymentData = {
      paymentId: session.id,
      status: Order.statusOptions.unpaid,
    };
    const newOrder = new Order({ productData: cart, userData, paymentData });
    orderId = (await newOrder.save()).insertedId;
  } catch (error) {
    return next(error);
  }

  req.session.cart = null;

  res.redirect(303, session.payerLink);
}

async function getSuccess(req, res) {
  const { token, PayerID } = req.query;

  try {
    const order = await Order.findByToken(token);
    if (order.paymentData.status === Order.statusOptions.unpaid) {
      order.paymentData.status = Order.statusOptions.paymentPending;
      order.paymentData.payerId = PayerID;
      await order.save();
    }
  } catch (e) {
    console.log(e);
  }

  res.render('customer/orders/success');
}

async function getFailure(req, res) {
  const { token } = req.query;

  try {
    const order = await Order.findByToken(token);
    if (order.paymentData.status === Order.statusOptions.unpaid) {
      order.paymentData.status = Order.statusOptions.paymentFailed;
      await order.save();
    }
  } catch (e) {
    console.log(e);
  }

  res.render('customer/orders/failure');
}

module.exports = {
  webhookHandler,
  getOrders,
  addOrder,
  getSuccess,
  getFailure,
};
