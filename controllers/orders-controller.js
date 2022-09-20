const stripe = require('stripe')(
  'sk_test_51LjNFREwabu2zB8bqo4Xu1hAdffCpmh9XD1kyEFWXL3XGfP1V8GVmU9XLTjNeFeB14S3W9rv0KvL0tBnP72D5nF9006WftYJyb'
);

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

  try {
    const userDoc = await User.findById(res.locals.uid);
    const order = new Order(cart, userDoc);
    await order.save();
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
    success_url: `http://localhost:3000/orders/success`,
    cancel_url: `http://localhost:3000/orders/failure`,
  });

  res.redirect(303, session.url);
}

function getSuccess(req, res) {
  res.render('customer/orders/success');
}

function getFailure(req, res) {
  res.render('customer/orders/failure');
}

module.exports = {
  getOrders: getOrders,
  addOrder: addOrder,
  getSuccess: getSuccess,
  getFailure: getFailure,
};
