const db = require('../data/database');
const { ObjectId } = require('mongodb');

class Order {
  static statusOptions = {
    unpaid: 'unpaid',
    paymentFailed: 'payment failed',
    paymentPending: 'payment pending',
    preparingForShipment: 'preparing for shipment',
    shipped: 'shipped',
    fulfilled: 'fulfilled',
    cancelled: 'cancelled',
  };

  // Status => unpaid, pending, fulfilled, cancelled
  constructor(orderData) {
    this.productData = orderData.productData;
    this.userData = orderData.userData;
    this.paymentData = orderData.paymentData;
    this.date = new Date(orderData.date ?? Date.now());
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    this.id = orderData._id;
  }

  static isStatusValid(inputStatus) {
    return Object.values(statusOptions).includes(inputStatus);
  }

  static transformOrderDocument(orderDoc) {
    return new Order(orderDoc);
  }

  static transformOrderDocuments(orderDocs) {
    return orderDocs.map(this.transformOrderDocument);
  }

  static async findAll() {
    const orders = await db
      .getDb()
      .collection('orders')
      .find()
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findAllForUser(userId) {
    const orders = await db
      .getDb()
      .collection('orders')
      .find({ 'userData.id': userId })
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findById(orderId) {
    const order = await db
      .getDb()
      .collection('orders')
      .findOne({ _id: new ObjectId(orderId) });

    return this.transformOrderDocument(order);
  }

  static async findByToken(paymentId) {
    const order = await db.getDb().collection('orders').findOne({ 'paymentData.paymentId': paymentId });

    return this.transformOrderDocument(order);
  }

  save() {
    if (this.id) {
      const orderId = new ObjectId(this.id);
      return db
        .getDb()
        .collection('orders')
        .updateOne(
          { _id: orderId },
          {
            $set: {
              'paymentData.status': this.paymentData.status,
              'paymentData.payerId': this.paymentData.payerId || '',
            },
          }
        );
    } else {
      return db.getDb().collection('orders').insertOne({
        productData: this.productData,
        userData: this.userData,
        paymentData: this.paymentData,
        date: this.date,
      });
    }
  }

  async delete() {
    const orderId = new ObjectId(this.id);
    return db.getDb().collection('orders').deleteOne({ _id: orderId });
  }
}

module.exports = Order;
