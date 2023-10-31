const Product = require('../models/product-model');

async function getAllProducts(req, res, next) {
  try {
    const slides = [
      {
        ...(await Product.findById('653fca13845e7a429a009660')),
        higherPrice: 1399.99,
      },
      {
        ...(await Product.findById('6540de33edcced66ae3b343a')),
        higherPrice: 300,
      },
      {
        ...(await Product.findById('653fcd13845e7a429a009664')),
        higherPrice: 37.5,
      },
    ];

    const products = await Product.findAll();
    res.render('customer/products/all-products', { products, slides });
  } catch (error) {
    next(error);
  }
}

async function getProductDetails(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    res.render('customer/products/product-details', { product: product });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllProducts: getAllProducts,
  getProductDetails: getProductDetails,
};
