const Product = require('../models/product-model');
const { capitalizeFirstLetter } = require('../util/helpers');

async function getProductsBySearch(req, res, next) {
  const {query} = req.query;

  try {
    const products = await Product.findBySearch(query);
    if (products.length === 0) {
      return res.render('shared/no-products');
    }
    res.render('customer/products/searched-products', { products, category: query });
  } catch (error) {
    next(error);
  }
}

async function getProductsByCategory(req, res, next) {
  let category = req.params.category;

  if (!Product.isCategoryValid(category) && category !== 'all') {
    return res.render('shared/404');
  }

  try {
    const slides = await Product.findAllSlides();

    let products;
    if (category === 'all') {
      products = await Product.findAll();
    } else {
      products = await Product.findByCategory(category);
    }
    
    category = capitalizeFirstLetter(category);
    res.render('customer/products/all-products', {
      products,
      slides,
      category,
    });
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
  getProductsBySearch,
  getProductsByCategory,
  getProductDetails,
};
