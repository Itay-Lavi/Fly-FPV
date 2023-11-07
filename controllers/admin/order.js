const Order = require('../../models/order-model');

async function getOrders(req, res, next) {
    try {
      const orders = await Order.findAll();
      res.render('admin/orders/admin-orders', {
        orders: orders,
      });
    } catch (error) {
      next(error);
    }
  }
  
  async function updateOrder(req, res, next) {
    const orderId = req.params.id;
    const newStatus = req.body.newStatus;

    if (!Order.isStatusValid(newStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
  
    try {
      const order = await Order.findById(orderId);
      
      order.status = newStatus;
      await order.save();
  
      res.json({ message: 'Order updated', newStatus: newStatus });
    } catch (error) {
      next(error);
    }
  }

  module.exports = {
    getOrders,
    updateOrder
  }