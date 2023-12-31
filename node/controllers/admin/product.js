const Product = require('../../models/product-model');
const validation = require('../../util/validation');
const sessionFlash = require('../../util/session-flash');

async function getProducts(req, res, next) {
  try {
    const products = await Product.findAll();
    res.render('admin/products/all-products', { products: products });
  } catch (error) {
    next(error);
    return;
  }
}

function getNewProduct(req, res) {
  const sessionErrorData = sessionFlash.getAlertSessionData(req, {
    title: '',
    summary: '',
    price: '',
    description: '',
  });

  res.render('admin/products/new-product', { product: sessionErrorData, categories: Product.productCategories });
}

async function createNewProduct(req, res, next) {
  const formData = { ...req.body, image: req.file.filename };
  const product = new Product(formData);

  if (!req.file || !validation.productDetailsIsValid(req.body)) {
    sessionFlash.flashAlertToSession(
      req,
      {
        message: 'Invalid - please check your data.',
        ...req.body,
      },
      async function () {
        try {
          await product.deleteImage();
        } catch {}
        res.redirect('/admin/products/new');
      }
    );

    return;
  }

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/admin/products');
}

async function getUpdateProduct(req, res, next) {
  let product;
  try {
    product = await Product.findById(req.params.id);
  } catch (error) {
    next(error);
  }

  const sessionErrorData = sessionFlash.getAlertSessionData(req, product);

  res.render('admin/products/update-product', { product: sessionErrorData, categories: Product.productCategories });
}

async function updateProduct(req, res, next) {
  const formData = { ...req.body, _id: req.params.id };
  const oldProduct = await Product.findById(req.params.id);
  const product = new Product({...formData, slider: oldProduct.slider});

  if (!validation.productDetailsIsValid(formData)) {
    sessionFlash.flashAlertToSession(
      req,
      {
        message: 'Invalid - please check your data.',
        ...product,
      },
      async function () {
        try {
          await product.deleteImage();
        } catch {}
        res.redirect('/admin/products/' + product.id);
      }
    );
    return;
  }

  if (req.file) {
    try {
      oldProduct.deleteLocalImage();
      oldProduct.deleteCloudImage();
    } catch (error) {
      next(error);
      return;
    }

    product.replaceImage(req.file.filename);
  }

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect('/admin/products');
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    await product.delete();
  } catch (error) {
    return res.status(500).json({ message: 'Error!' });
  }

  res.json({ message: 'Product deleted!' });
}

module.exports = {
  getProducts,
  getNewProduct,
  createNewProduct,
  getUpdateProduct,
  updateProduct,
  deleteProduct
};
