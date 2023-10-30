const stripe = require('stripe')(STRIPE_API_KEY);

const Order = require('../models/order-model');
const User = require('../models/user-model');

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

  let orderId;
  try {
    const userDoc = await User.findById(res.locals.uid);
    const newOrder = new Order(cart, userDoc);
    orderId = (await newOrder.save()).insertedId;
  } catch (error) {
    return next(error);
  }

  req.session.cart = null;

  const session = await stripe.checkout.sessions.create({
    line_items: cart.items.map(function (item) {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.title,
          },
          unit_amount: +item.product.price.toFixed(2) * 100,
        },
        quantity: item.quantity,
      };
    }),
    mode: 'payment',
    success_url: `http://${HOSTNAME}/orders/success/${orderId}`,
    cancel_url: `http://${HOSTNAME}/orders/failure/${orderId}`,
  });

  res.redirect(303, session.url);
}

async function getSuccess(req, res) {
  const order = await Order.findById(req.params.id);
  if (order.status != 'unpaid') {
    return res.render('shared/404');
  };
	res.render('customer/orders/success');
	order.status = 'pending'
	await order.save();
}

async function getFailure(req, res) {
  const order = await Order.findById(req.params.id);
  if (order.status != 'unpaid') {
    return res.render('shared/404');
  };
  res.render('customer/orders/failure');
  order.status = 'payment failed'
	await order.save();
}

module.exports = {
  getOrders: getOrders,
  addOrder: addOrder,
  getSuccess: getSuccess,
  getFailure: getFailure,
};
