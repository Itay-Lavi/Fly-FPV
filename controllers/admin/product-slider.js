const Product = require('../../models/product-model');

async function getSliderProducts(req, res, next) {
    const products = await Product.findAll();
    products.sort((a, b) => (a.slider === b.slider) ? 0 : a.slider ? -1 : 1);
  
    res.render('admin/products/slider', { products });
  }
  
  async function addProductToSlider(req, res, next) {
    try {
      const product = await Product.findById(req.params.id);
      product.addOrRemoveSlide(true);
    } catch (error) {
      return res.status(500).json({ message: 'Error!' });
    }
  
    res.json({ message: 'Product added to slider!' });
  }
  
  async function removeProductFromSlider(req, res, next) {
    try {
      const product = await Product.findById(req.params.id);
      product.addOrRemoveSlide(false);
    } catch (error) {
      return res.status(500).json({ message: 'Error!' });
    }
    res.json({ message: 'Product removed from slider!' });
  }

module.exports = {
    getSliderProducts,
    addProductToSlider,
    removeProductFromSlider,
}