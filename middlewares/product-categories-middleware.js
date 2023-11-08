const Product = require('../models/product-model');

function addProductCategories(req, res, next) {
  res.locals.productCategories = Product.productCategories;
  next();
}

module.exports = addProductCategories;