const Product = require('../../models/product-model');
const { ObjectId } = require('mongodb');

async function getSliderProducts(req, res, next) {
  let products = await Product.findAll();
  products = products.map((prod) => ({ ...prod, status: prod.slider }));
  products.sort((a, b) => (a.slider === b.slider ? 0 : a.slider ? -1 : 1));

  res.render('admin/products/products-picker', {
    products,
    title: 'Slider',
    productId: null,
  });
}

async function getComplementaries(req, res, next) {
  const id = req.params.id;
  if (!id) return res.render('shared/404');

  let allProducts;
  let selectedProduct;
  try {
    allProducts = await Product.findAll();
    selectedProduct = await Product.findById(id);
  } catch (err) {
    return res.render('shared/404');
  }

  allProducts = allProducts.filter((prod) => prod.id !== id);

  allProducts = allProducts.map((prod) => {
    const status =
      selectedProduct.complementaries?.some(
        (complementary) => complementary.toString() === prod.id
      ) ?? false;
    return { ...prod, status };
  });
  allProducts.sort((a, b) => (a.status === b.status ? 0 : a.status ? -1 : 1));

  res.render('admin/products/products-picker', {
    products: allProducts,
    title: 'Complementaries',
    productId: id,
  });
}

async function handleSlider(req, res, next) {
  const method = req.method;

  try {
    const product = await Product.findById(req.params.id);
    await product.handleSlider(method === 'POST');
  } catch (error) {
    return res.status(500).json({ message: 'Error!' });
  }

  res.json({
    message: `Product ${
      method == 'POST' ? 'added to' : 'removed from'
    } slider!`,
  });
}

async function handleComplementary(req, res, next) {
  const method = req.method;
  const productId = req.params.id;
  const complementaryId = req.body.choosenProductId;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (error) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const isAlreadyAdded = product.complementaries?.some(
    (complementary) => complementary.toString() === complementaryId
  );

  if (isAlreadyAdded && method == 'POST') {
    return res.status(400).json({ message: 'Product already added' });
  }

  try {
    await product.handleComplementary(complementaryId, method == 'POST');
    return res.status(200).json({ message: 'Product added successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error!' });
  }
}

module.exports = {
  getSliderProducts,
  handleSlider,
  getComplementaries,
  handleComplementary,
};
